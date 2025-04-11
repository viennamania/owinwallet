import { NextResponse, type NextRequest } from "next/server";

import moment from 'moment';

import { Network, Alchemy, AssetTransfersCategory, SortingOrder } from 'alchemy-sdk';



import {
  getOneByWalletAddress,
  getOneByTelegramId,
} from '@lib/api/user';



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
    ///smartWallet,
    getWalletBalance,
    SmartWalletOptions,
} from "thirdweb/wallets";

import {
  smartWallet,
  //////DEFAULT_ACCOUNT_FACTORY_V0_7,
} from "thirdweb/wallets/smart";

 




import {
    mintTo,
    //totalSupply,
    transfer,
    
    getBalance,
  
    //balanceOf,
  
} from "thirdweb/extensions/erc20";


import { parse } from "path";
import { token } from "thirdweb/extensions/vote";


///import { Network, Alchemy } from 'alchemy-sdk';


//import { useSearchParams } from 'next/navigation'
 

////const chain = polygon;


// USDT Token (USDT)
const tokenContractAddressUSDT = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';




export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';



const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);




export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
      lang,
      chain,
      walletAddress,
      amount,
      toWalletAddress,
  } = body;


  console.log("body", body);



  try {



    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY || "",
    });

    


  
    if (!client) {
      return NextResponse.json({
        result: null,
      });
    }


    const contractUSDT = getContract(
      {
        client: client,
        chain: polygon,
        address: tokenContractAddressUSDT,
      }
    );

    const snowballWalletPrivateKey = process.env.SNOWBALL_WALLET_PRIVATE_KEY || "";



    const personalAccount = privateKeyToAccount({
      client,
      privateKey: snowballWalletPrivateKey,
    });

    const wallet = smartWallet({
      chain: polygon,
      sponsorGas: true,
      ///factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_7, // 0.7 factory address

    });

    const account = await wallet.connect({
      client: client,
      personalAccount: personalAccount,
    });

    const snowballWalletAddress = account.address;

    console.log("snowballWalletAddress: ", snowballWalletAddress);
    // 0xef236138f40fadCac5Af0E01bB51612ad116C91f












      


      const transactions = [] as any;



      const transactionMaster = transfer({
        contract: contractUSDT,
        to: toWalletAddress,
        amount: amount,
      });
      transactions.push(transactionMaster);



      
      const batchOptions: SendBatchTransactionOptions = {
        account: account,
        transactions: transactions,
      };
      
      const batchResponse = await sendBatchTransaction(
        batchOptions
      );
      console.log("batchResponse", batchResponse);

      if (!batchResponse) {
        return NextResponse.json({
          result: {
            error: "batchResponse is null",
          },
        });
      }



      return NextResponse.json({
        result: {
          response: batchResponse,
        },


      });





    } catch (error) {
      console.error("error", error);
      return NextResponse.json({
          
          result: {
              error,
          },
      });

    }
      




    return NextResponse.json({
        
        result: {
            transactions,
        },
    });



    /*
    const response = await alchemy.nft.getNftsForOwner(
      walletAddress, {
      omitMetadata: false, // // Flag to omit metadata
    });
  
    ///console.log("response?.ownedNfts", response?.ownedNfts);
  
  
    // get tokenType is 'ERC721' from the response
  
    response?.ownedNfts?.map((nft) => {
    */





      /*
      //console.log("members: ", members);
    
      // amount is random from 0.00001 to 0.1
      const amount = Math.random() * (1 - 0.00001) + 0.00001;

    
      const client = createThirdwebClient({
        secretKey: process.env.THIRDWEB_SECRET_KEY || "",
      });
    
      
      //const contractOptions: ContractOptions = {
      //  client: client,
      //  chain: chain,
      //  address: tokenContractAddressUSDT,
      //};
      
      
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
    
    

      //console.log("members: ", members);

    
      let transactions = [] as any;
    
      const sendAmount = amount / members.length;
    
      members.forEach(async (member : any) => {
    
        const toWalletAddress = member.walletAddress;

        const transaction = transfer({
          contract: contractUSDT,
          to: toWalletAddress,
          amount: sendAmount,
        });
    
        transactions.push(transaction);
    
      } );
    

    

    
      const batchOptions: SendBatchTransactionOptions = {
        account: account,
        transactions: transactions,
      };
    
      const batchResponse = await sendBatchTransaction(
        batchOptions
      );



    return NextResponse.json({
        
        result: {
            members,
            amount,
            claimWalletAddress,
        },
    });
    */

}
