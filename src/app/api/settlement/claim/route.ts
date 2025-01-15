import { NextResponse, type NextRequest } from "next/server";

import {
  getOneByApplicationId,
	setSettlementClaim,
  setAgentBotIncentive,
} from '@lib/api/agent';



import {
	createThirdwebClient,

	///ContractOptions,

	getContract,
	sendAndConfirmTransaction,
	
	sendBatchTransaction,

	SendBatchTransactionOptions,
  
} from "thirdweb";


//import { polygonAmoy } from "thirdweb/chains";
import { polygon } from "thirdweb/chains";

import {
	privateKeyToAccount,
	smartWallet,
	getWalletBalance,
	SmartWalletOptions,
} from "thirdweb/wallets";

import {
	mintTo,
	totalSupply,
	transfer,
	
	getBalance,
  
	balanceOf,
  
} from "thirdweb/extensions/erc20";


import { Network, Alchemy } from 'alchemy-sdk';



const chain = polygon;


// USDT Token (USDT)
const tokenContractAddressUSDT = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';



const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);





export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';


export async function POST(request: NextRequest) {

  const body = await request.json();


  const { applicationId } = body;

  if (!applicationId) {
    return NextResponse.error();
  }





  const client = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY || "",
  });

  /*
  const contractOptions: ContractOptions = {
    client: client,
    chain: chain,
    address: tokenContractAddressUSDT,
  };
  */
  
  const contractUSDT = getContract(
    //contractOptions
    {
      client: client,
      chain: chain,
      address: tokenContractAddressUSDT,
    }
  );

  const claimWalletPrivateKey = process.env.CLAIM_WALLET_PRIVATE_KEY || "";

  const personalAccount = privateKeyToAccount({
    client,
    privateKey: claimWalletPrivateKey,
  });

  const wallet = smartWallet({
    chain: chain,
    sponsorGas: true,
  });

  const account = await wallet.connect({
    client: client,
    personalAccount: personalAccount,
  });

  const claimWalletAddress = account.address;

  //console.log("claimWalletAddress: ", claimWalletAddress);
  // 0x4EF39b249A165cdA40b9c7b5F64e79bAb78Ff0C2




  const application = await getOneByApplicationId(applicationId);


  //console.log("application: ", application);




  if (!application) {
    return NextResponse.error();
  }


  try {

      const okxUid = application.okxUid;
      const tradingAccountBalance = application.tradingAccountBalance;

      const lastUnclaimedTradingVolume = parseFloat(application?.lastUnclaimedTradingVolume) || 0;

      const claimedTradingVolume = parseFloat(application?.claimedTradingVolume) || 0;

      const tradingVolume = parseFloat(application.affiliateInvitee?.data?.volMonth) || 0;

      /*
      if (tradingVolume <= (claimedTradingVolume + 1000)) {
        return NextResponse.error();
      }
      */


      const settlementTradingVolume = tradingVolume - claimedTradingVolume;


      const totalSettlementTradingVolume = settlementTradingVolume + lastUnclaimedTradingVolume;

      //console.log("totalSettlementTradingVolume: ", totalSettlementTradingVolume);

      if (totalSettlementTradingVolume <= 0) {
        return NextResponse.error();
      }



      // 1. master wallet address
      const masterWalletAddress = application.walletAddress;


      // 2. agent wallet address
      // get agentWalletAddress from agentBot and agentBotNumber
      //     const response = await alchemy.nft.getOwnersForNft(address, tokenId)

      const nftContractAddress = application.agentBot;
      const tokenId = application.agentBotNumber;

      const response = await alchemy.nft.getOwnersForNft(nftContractAddress, tokenId);
      /* { owners: [ '0xf5fff32cf83a1a614e15f25ce55b0c0a6b5f8f2c' ] } */

      const agentWalletAddress = response?.owners[0] || "";

      //console.log("agentWalletAddress: ", agentWalletAddress);

      if (!agentWalletAddress) {
        return NextResponse.error();
      }


      // 3. center wallet address
      //const centerWalletAddress = "";
      // api call to get centerWalletAddress
      // POST https://https://shinemywinter.vercel.app/api/user/getCenterOwnerByCenter
      // { center: center }

      const center = application.center;

      const getCenterOwnerByCenter = await fetch(`https://shinemywinter.vercel.app/api/user/getCenterOwnerByCenter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          center: center,
        }),
      })

      const centerOwner = await getCenterOwnerByCenter.json();

      ///console.log('centerOwner: ' + JSON.stringify(centerOwner));

      const centerWalletAddress = centerOwner?.result?.walletAddress || "";


      if (!centerWalletAddress) {
        return NextResponse.error();
      }




      const tradingFee = totalSettlementTradingVolume * 0.000455;


      // calculate insentive
      //////////////////////////////////////////////////////////////

      const insentive = Number(tradingFee * 0.23).toFixed(8);

      const masterInsentive = Number(tradingFee * 0.23 * 0.56).toFixed(8);

      const agentInsentive = Number(tradingFee * 0.23 * 0.28).toFixed(8);

      const centerInsentive = Number(tradingFee * 0.23 * 0.14).toFixed(8);
      
 






      const transactionMasterWalletAddress = transfer({
        contract: contractUSDT,
        to: masterWalletAddress,
        amount: masterInsentive,
      });

      const transactionAgentWalletAddress = transfer({
        contract: contractUSDT,
        to: agentWalletAddress,
        amount: agentInsentive,
      });

      const transactionCenterWalletAddress = transfer({
        contract: contractUSDT,
        to: centerWalletAddress,
        amount: centerInsentive,
      });

      const batchOptions: SendBatchTransactionOptions = {
        account: account,
        transactions: [
          transactionMasterWalletAddress,
          transactionAgentWalletAddress,
          transactionCenterWalletAddress,
        ],
      };


      const batchResponse = await sendBatchTransaction(
        batchOptions
      );


      //console.log("batchResponse: ", batchResponse);

      if (!batchResponse) {
        return NextResponse.error();
      }








      const settlementClaim = {
        okxUid: okxUid,
        tradingAccountBalance: tradingAccountBalance,
        tradingVolume: tradingVolume,
        settlementTradingVolume: settlementTradingVolume,
        totalSettlementTradingVolume: totalSettlementTradingVolume,
        tradingFee: tradingFee,
        insentive: insentive,
        masterInsentive: masterInsentive,
        masterWalletAddress: masterWalletAddress,

        agentContract: nftContractAddress,
        agentTokenId: tokenId,
        agentInsentive: agentInsentive,
        agentWalletAddress: agentWalletAddress,

        center: center,
        centerInsentive: centerInsentive,
        centerWalletAddress: centerWalletAddress,
      };


      

      
      const result = await setSettlementClaim({
        applicationId: applicationId,
        settlementClaim: settlementClaim,
      });


      /*
      if (!result) {
        return NextResponse.error();
      }
      */




      // master insentive message
      // https://shinemywinter.vercel.app/api/telegram/setSettlementMessageByWalletAddress
      // POST

      ///console.log("masterWalletAddress: ", masterWalletAddress);
      ///console.log("masterInsentive: ", masterInsentive);




      await fetch(`https://shinemywinter.vercel.app/api/telegram/setSettlementMessageByWalletAddress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          center: center,
          walletAddress: masterWalletAddress,
          message: `You have received ${masterInsentive} USDT as master incentive.`,
        }),
      })


      // agent insentive message
      // https://shinemywinter.vercel.app/api/telegram/setSettlementMessageByWalletAddress
      // POST

      await fetch(`https://shinemywinter.vercel.app/api/telegram/setAgentMessageByWalletAddress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          center: center,
          contract: nftContractAddress,
          tokenId: tokenId,
          walletAddress: agentWalletAddress,
          message: `You have received ${agentInsentive} USDT as agent incentive.`,
        }),
      })


      // center insentive message
      // https://shinemywinter.vercel.app/api/telegram/setSettlementMessageByWalletAddress
      // POST
      await fetch(`https://shinemywinter.vercel.app/api/telegram/setSettlementMessageByWalletAddress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          center: center,
          walletAddress: centerWalletAddress,
          message: `You have received ${centerInsentive} USDT as center incentive.`,
        }),
      })

      
    






      return NextResponse.json({
        result: result,
      });



  } catch (error) {
    console.error(error+"");
    return NextResponse.error();
  }

  

  
}
