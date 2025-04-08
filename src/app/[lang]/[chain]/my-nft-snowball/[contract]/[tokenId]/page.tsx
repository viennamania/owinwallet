// send USDT
'use client';


import React, { useEffect, useState } from 'react';

import { toast } from 'react-hot-toast';


import {
    //ThirdwebProvider,
    ConnectButton,
  
    useConnect,
  
    useReadContract,
  
    useActiveWallet,

    useActiveAccount,
    useSendBatchTransaction,

    useConnectedWallets,

    useSetActiveWallet,

    AutoConnect,
    
} from "thirdweb/react";

import {
    polygon,
    arbitrum,
} from "thirdweb/chains";

import {
    getContract,
    //readContract,
    sendTransaction,
    sendAndConfirmTransaction,
} from "thirdweb";



import { balanceOf, transfer } from "thirdweb/extensions/erc20";
 

 
import {
  getOwnedNFTs,
  transferFrom,
} from "thirdweb/extensions/erc721";



import Image from 'next/image';





const contractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT on Polygon
const contractAddressArbitrum = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"; // USDT on Arbitrum

const contractAddressTron = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // USDT on Tron




/*
const smartWallet = new smartWallet(config);
const smartAccount = await smartWallet.connect({
  client,
  personalAccount,
});
*/

import {
  useRouter,
  useSearchParams
} from "next//navigation";


import {
    inAppWallet,
    createWallet,
  } from "thirdweb/wallets";


import { client } from "../../../../../client";
import { add } from 'thirdweb/extensions/farcaster/keyGateway';




const wallets = [
    inAppWallet({
      auth: {
        options: [
          "google",
          "discord",
          "email",
          "x",
          "passkey",
          "phone",
          "facebook",
          "line",
          "apple",
          "coinbase",
        ],
      },
    }),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    createWallet("io.rabby"),
    createWallet("io.zerion.wallet"),
    createWallet("io.metamask"),
    //createWallet("com.binance.wallet"),
    createWallet("com.bitget.web3"),
    createWallet("com.trustwallet.app"),
    createWallet("com.okex.wallet"),
];




export default function AgentPage({ params }: any) {

  const agentContractAddress = params.contract;
  const agentTokenId = params.tokenId;

  //console.log("agentContractAddress", agentContractAddress);
  //console.log("agentTokenId", agentTokenId);

  //console.log("params", params);

  const searchParams = useSearchParams();
 
 

  //console.log("agentContractAddress", agentContractAddress);



   
  ///console.log("agent", agent);

  ///console.log("loadingAgent", loadingAgent);
  
  
  const contract = getContract({
    // the client you have created via `createThirdwebClient()`
    client,
    // the chain the contract is deployed on
    
    
    chain: params.chain === "arbitrum" ? arbitrum : polygon,
  
  
  
    // the contract's address
    ///address: contractAddress,

    address: params.chain === "arbitrum" ? contractAddressArbitrum : contractAddress,


    // OPTIONAL: the contract's abi
    //abi: [...],
  });





  const [data, setData] = useState({
    title: "",
    description: "",

    menu : {
      buy: "",
      sell: "",
      trade: "",
      chat: "",
      history: "",
      settings: "",
    },

    Go_Home: "",
    My_Balance: "",
    My_Nickname: "",
    My_Buy_Trades: "",
    My_Sell_Trades: "",
    Buy: "",
    Sell: "",
    Buy_USDT: "",
    Sell_USDT: "",
    Contact_Us: "",
    Buy_Description: "",
    Sell_Description: "",
    Send_USDT: "",
    Pay_USDT: "",
    Coming_Soon: "",
    Please_connect_your_wallet_first: "",

    USDT_sent_successfully: "",
    Failed_to_send_USDT: "",

    Go_Buy_USDT: "",
    Enter_Wallet_Address: "",
    Enter_the_amount_and_recipient_address: "",
    Select_a_user: "",
    User_wallet_address: "",
    This_address_is_not_white_listed: "",
    If_you_are_sure_please_click_the_send_button: "",

    Sending: "",

    Anonymous: "",

    My_Wallet_Address: "",

  } );

  /*
  useEffect(() => {
      async function fetchData() {
          const dictionary = await getDictionary(params.lang);
          setData(dictionary);
      }
      fetchData();
  }, [params.lang]);
    */

  const {
    title,
    description,
    menu,
    Go_Home,
    My_Balance,
    My_Nickname,
    My_Buy_Trades,
    My_Sell_Trades,
    Buy,
    Sell,
    Buy_USDT,
    Sell_USDT,
    Contact_Us,
    Buy_Description,
    Sell_Description,
    Send_USDT,
    Pay_USDT,
    Coming_Soon,
    Please_connect_your_wallet_first,

    USDT_sent_successfully,
    Failed_to_send_USDT,

    Go_Buy_USDT,
    Enter_Wallet_Address,
    Enter_the_amount_and_recipient_address,
    Select_a_user,
    User_wallet_address,
    This_address_is_not_white_listed,
    If_you_are_sure_please_click_the_send_button,

    Sending,

    Anonymous,

    My_Wallet_Address,

  } = data;



  const router = useRouter();



  const activeAccount = useActiveAccount();

  const address = activeAccount?.address;





  const [nickname, setNickname] = useState("");
  const [userCode, setUserCode] = useState("");
  const [avatar, setAvatar] = useState("/profile-default.png");

  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch("/api/user/getUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                walletAddress: address,
            }),
        });

        const data = await response.json();

        if (data.result) {
            setNickname(data.result.nickname);
            
            data.result.avatar && setAvatar(data.result.avatar);
            

            setUserCode(data.result.id);


        } else {
            setNickname('');
            setAvatar('/profile-default.png');
            setUserCode('');
        }

    };

    if (address) fetchData();
    
  }, [address]);
 


  
  const [nftInfo, setNftInfo] = useState(null as any);
  
 
  const [holderWalletAddress, setHolderWalletAddress] = useState("");


  const [ownerInfo, setOwnerInfo] = useState({} as any);

  const [loadingAgent, setLoadingAgent] = useState(false);

  const [animationUrl, setAnimationUrl] = useState("");
  useEffect(() => {
      
      const getAgent = async () => {

        setLoadingAgent(true);
  
        const response = await fetch('/api/agent/getAgentNFTByContractAddressAndTokenId', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress: address,
            erc721ContractAddress: agentContractAddress,
            tokenId: agentTokenId,
          }),
        });

        if (!response) {
          setLoadingAgent(false);
          return;
        }
  
        const data = await response.json();

        //console.log("getAgentNFTByContractAddressAndTokenId data", data);

        if (data.result.raw?.metadata?.animation_url) {
            setAnimationUrl(
                data.result.raw.metadata.animation_url.replace("ipfs://", "https://ipfs.io/ipfs/")
            );
        }
  
        console.log("getAgentNFTByContractAddressAndTokenId data", data);

        setNftInfo(data.result);

        setOwnerInfo(data?.ownerInfo);
        setHolderWalletAddress(data?.ownerWalletAddress);


        ////console.log("agent======", data.result);

        setLoadingAgent(false);
  
      };
  
      if (address && agentContractAddress && agentTokenId) getAgent();
  
  }, [address, agentContractAddress, agentTokenId]);

  // transferFrom

  const [transferToAddress, setTransferToAddress] = useState("");

  const [loadingTransfer, setLoadingTransfer] = useState(false);

  const nftTransfer = async (to: string) => {

    if (!address) {
      toast.error("Please connect your wallet first");
      return
    }
    if (!to) {
      toast.error("Please enter the recipient's wallet address");
      return
    }

    setLoadingTransfer(true);

    const contract = getContract({
      client,
      chain: polygon,
      address: agentContractAddress,
    });

    const transaction = transferFrom({
      contract,
      from: address,
      to: to,
      tokenId: agentTokenId,
    });

    const { transactionHash } = await sendTransaction({
      account: activeAccount as any,
      transaction,
    });

    
    if (transactionHash) {

      setTransferToAddress("");

      // getAgent
      const response = await fetch('/api/agent/getAgentNFTByContractAddressAndTokenId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          erc721ContractAddress: agentContractAddress,
          tokenId: agentTokenId,
        }),
      });
      if (response) {
        const data = await response.json();
        setNftInfo(data.result);
        setOwnerInfo(data.ownerInfo);
      }

      toast.success("NFT transferred successfully");

    } else {
        
      toast.error("Failed to transfer NFT");

    }

    setLoadingTransfer(false);

  }







    // getPositionList
    const [checkingPositionList, setCheckingPositionList] = useState([] as any[]);
    const [positionList, setPositionList] = useState([] as any[]);
    /*
    {"positions":
        [
            {"lever":"5","position_side":"long","contract_code":"BCH-USDT","open_avg_price":"377.48","volume":"136","margin_mode":"cross","position_margin":"103.53408","margin_rate":"0.033641785791011462","unreal_profit":"4.2976","profit":"4.2976","profit_rate":"0.041856522199851645","liquidation_price":"19.61"},
            {"lever":"5","position_side":"long","contract_code":"ONDO-USDT","open_avg_price":"0.7358","volume":"327","margin_mode":"cross","position_margin":"48.31752","margin_rate":"0.033641785791011462","unreal_profit":"0.977100000000000051","profit":"0.977100000000000051","profit_rate":"0.020304600173309145","liquidation_price":null},
            {"lever":"5","position_side":"long","contract_code":"MEW-USDT","open_avg_price":"0.009241","volume":"32","margin_mode":"cross","position_margin":"58.4384","margin_rate":"0.033641785791011462","unreal_profit":"-3.545999999999968","profit":"-3.545999999999968","profit_rate":"-0.05995171401713626","liquidation_price":null}
        ]
    }
    */






    // getSettlementHistoryByAgentWalletAddress
    const [settlementHistory, setSettlementHistory] = useState([] as any[]);
    const [loadingSettlementHistory, setLoadingSettlementHistory] = useState(false);
    const getSettlementHistory = async () => {
        
        setLoadingSettlementHistory(true);

        const response = await fetch("/api/agent/getSettlementHistoryByAgentWalletAddress", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                limit: 10,
                page: 0,
                walletAddress: holderWalletAddress,
            }),
        });

        if (!response.ok) {
            console.error("Error fetching settlement history");
            setLoadingSettlementHistory(false);
            return;
        }

        const data = await response.json();

        console.log("data", data);

        if (data.settlements) {
            setSettlementHistory(data.settlements);
        } else {
            setSettlementHistory([]);
        }

        setLoadingSettlementHistory(false);

    }

    useEffect(() => {
        holderWalletAddress && getSettlementHistory();
    } , [holderWalletAddress]);




    //console.log("nftInfo", nftInfo);





  return (

    <main className="
      pb-10
      p-0 min-h-[100vh] flex-col items-start justify-center container max-w-screen-lg mx-auto
      bg-[#E7EDF1]
    ">

      <div className="w-full flex flex-col items-start justify-start gap-5 p-4">

        {/* go back button */}
        <div className="mt-4 flex justify-start space-x-4 mb-10">
            <button
              
              onClick={() => router.back()}

              className="text-gray-600 font-semibold underline">
              홈으로
            </button>
        </div>
 


        <div className="w-full flex flex-col items-start justify-start gap-5">


          {/* agent nft info */}
          <div className={`w-full flex flex-col gap-5 p-4 rounded-lg border bg-gray-100
            ${address && holderWalletAddress && address === holderWalletAddress ? 'border-green-500' : 'border-gray-300'}
          `}>


            {address && holderWalletAddress && address === holderWalletAddress && (
              <div className='flex flex-row items-center gap-2'>
                {/* dot */}
                <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                <span className='text-lg text-green-500 font-semibold'>
                    당신은 이 NFT의 소유자입니다.
                </span>
              </div>
            )}


            {loadingAgent && (
              <div className='w-full flex flex-row items-center justify-center'>
                <Image
                  src="/loading.png"
                  alt="Loading"
                  width={50}
                  height={50}
                  className="rounded-lg animate-spin"
                />
              </div>
            )}


            {!loadingAgent && nftInfo && (

              <div className='w-full flex flex-col gap-5'>



                <div className='w-full flex flex-row items-center justify-between gap-2
                 border-b border-gray-300 pb-2
                '>
                    {/* opensea */}
                    <button
                        onClick={() => {
                            window.open('https://opensea.io/assets/matic/' + agentContractAddress + '/' + agentTokenId);
                        }}
                        className="p-2 rounded hover:bg-gray-300"
                    >
                        <Image
                            src="/logo-opensea.png"
                            alt="OpenSea"
                            width={50}
                            height={50}
                            className="rounded-lg"
                        />
                    </button>

                </div>


                <div className='w-full grid grid-cols-1 xl:grid-cols-2 items-start justify-start gap-5'>


                  <div className='w-full flex flex-row items-start justify-start gap-5'>

                      <Image
                            src={nftInfo?.tokenId === '0' ? '/logo-snowbot300.png' : '/logo-snowbot3000.png'}
                            width={200}
                            height={200}
                            alt="NFT"
                            className='w-1/4 rounded-lg object-cover'
                        />

                        <div className="w-3/4 flex flex-col gap-1 items-center justify-center">

                          <div className="w-full flex flex-row gap-2 items-center justify-start">
                            <div className="w-1/2 text-sm text-zinc-800 font-bold">
                                이름
                            </div>
                            <div className="w-full text-sm text-zinc-800 font-bold text-right">
                                {nftInfo?.name}
                            </div>
                          </div>

                          <div className="w-full flex flex-row gap-2 items-center justify-start">
                            <div className="w-1/2 text-sm text-zinc-800 font-bold">
                                계약번호
                            </div>
                            <div className="w-full text-sm text-zinc-800 font-bold text-right">
                                #{nftInfo?.tokenId}
                            </div>
                          </div>

                          <div className="w-full flex flex-row gap-2 items-center justify-start">
                            <div className="w-1/2 text-sm text-zinc-800 font-bold">
                                수량
                            </div>
                            <div className="w-full text-sm text-zinc-800 font-bold text-right">
                                0 개
                            </div>
                          </div>

                          <div className="w-full flex flex-row gap-2 items-center justify-start">
                            <div className="w-1/2 text-sm text-zinc-800 font-bold">
                                누적 리워드
                            </div>
                            <div className="w-full text-sm text-zinc-800 font-bold text-right">
                                0.00 USDT
                            </div>
                          </div>

                          <div className="w-full flex flex-row gap-2 items-center justify-start">
                            <div className="w-1/2 text-sm text-zinc-800 font-bold">
                                누적 수익률
                            </div>
                            <div className="w-full text-sm text-zinc-800 font-bold text-right">
                                0.00%
                            </div>
                          </div>

                        </div>



                  </div>


                </div>



              </div>

            )}

          </div>



        </div>

       </div>

    </main>

  );

}
