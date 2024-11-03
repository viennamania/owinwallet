// nickname settings
'use client';
import React, { use, useEffect, useState } from 'react';



import { toast } from 'react-hot-toast';

import { client } from "../../../client";


import {
    getContract,
    //readContract,
    sendTransaction,
    sendAndConfirmTransaction,
} from "thirdweb";

import { balanceOf, transfer } from "thirdweb/extensions/erc20";
 


import {
    polygon,
    arbitrum,
} from "thirdweb/chains";

import {
    ConnectButton,
    useActiveAccount,
    useActiveWallet,
    useConnectModal,
} from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";


import { getUserPhoneNumber } from "thirdweb/wallets/in-app";


import Image from 'next/image';

//import GearSetupIcon from "@/components/gearSetupIcon";

//import Uploader from '@/components/uploader';
//import { add } from 'thirdweb/extensions/farcaster/keyGateway';




import { useRouter }from "next//navigation";



import AppBarComponent from "@/components/Appbar/AppBar";
import { getDictionary } from "../../../dictionaries";



import axios from 'axios';

import { deployERC721Contract } from 'thirdweb/deploys';

import {
    lazyMint,
    claimTo,
    mintTo,
 
    totalSupply,
    nextTokenIdToMint,
  
    //nextTokenIdToClaim,

    getOwnedNFTs,
  
} from "thirdweb/extensions/erc1155";

import { Alert } from '@mui/material';


import thirdwebIcon from "@public/thirdweb.svg";


const wallets = [
    inAppWallet({
      auth: {
        options: ["phone"],
      },
    }),
];


const contractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT on Polygon
const contractAddressArbitrum = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"; // USDT on Arbitrum





export default function AIPage({ params }: any) {


    console.log("SettingsPage params", params);
    
    
    
    
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

        Wallet_Settings: "",
        Profile_Settings: "",


        My_Wallet_Address: "",
        My_Phone_Number: "",
    
        Wallet_Address_Description1: "",
        Wallet_Address_Description2: "",
    
        I_understand_that_I_should_never_deposit_any_other_tokens: "",

        Copy: "",

        Disconnect_Wallet: "",


        Prompt_input_placeholder: "",

        Real_prompt: "",

        Generate_prompt: "",
    
        Reset_prompt: "",

        Generating_prompt: "",

        Download_Image: "",

        Downloading_Image: "",

        Alert_download_image_success: "",
    
        Make_OpenSea_Collection: "",

        Alert_OpenSea_Collection_made: "",

        If_you_make_an_OpenSea_collection: "",

        Making_OpenSea_Collection: "",

        OpenSea_Collection_Address: "",

        OpenSea_Collection: "",

        Mint_NFT: "",

        Alert_NFT_minted: "",

        Minting_NFT: "",

        Loading_my_images: "",
    
    } );
    
    useEffect(() => {
        async function fetchData() {
            const dictionary = await getDictionary(params.lang);
            setData(dictionary);
        }
        fetchData();
    }, [params.lang]);
    
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

        Wallet_Settings,
        Profile_Settings,

        My_Wallet_Address,
        My_Phone_Number,

        Wallet_Address_Description1,
        Wallet_Address_Description2,

        I_understand_that_I_should_never_deposit_any_other_tokens,

        Copy,

        Disconnect_Wallet,


        Prompt_input_placeholder,

        Real_prompt,

        Generate_prompt,

        Reset_prompt,

        Generating_prompt,

        Download_Image,

        Downloading_Image,

        Alert_download_image_success,

        Make_OpenSea_Collection,

        If_you_make_an_OpenSea_collection,

        Making_OpenSea_Collection,

        Alert_OpenSea_Collection_made,

        OpenSea_Collection_Address,

        OpenSea_Collection,

        Mint_NFT,

        Alert_NFT_minted,

        Minting_NFT,

        Loading_my_images,

    } = data;
    
    
    






    const router = useRouter();

    // get the active wallet
    const activeWallet = useActiveWallet();



    const smartAccount = useActiveAccount();

    const address = smartAccount?.address || "";



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





    const [balance, setBalance] = useState(0);

    useEffect(() => {
  
      if (!address) return;
      // get the balance
  
  
      if (!contract) {
        return;
      }
  
      const getBalance = async () => {
  
        try {
          const result = await balanceOf({
            contract,
            address: address,
          });
      
          //console.log(result);
      
          setBalance( Number(result) / 10 ** 6 );
  
        } catch (error) {
          console.error("Error getting balance", error);
        }
  
      };
  
      if (address) getBalance();
  
      // get the balance in the interval
  
      const interval = setInterval(() => {
        getBalance();
      }, 1000);
  
  
      return () => clearInterval(interval);
  
    } , [address, contract]);



    

    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
  
  
      if (smartAccount) {
  
        //const phoneNumber = await getUserPhoneNumber({ client });
        //setPhoneNumber(phoneNumber);
  
  
        getUserPhoneNumber({ client }).then((phoneNumber) => {
          setPhoneNumber(phoneNumber || "");
        });
  
  
  
      }
  
    } , [smartAccount]);


    const { connect, isConnecting } = useConnectModal();

    const handleConnect = async () => {
      await connect({
        chain: params.chain === "arbitrum" ? arbitrum : polygon,
        client,
        wallets,
  
        accountAbstraction: {
            chain: params.chain === "arbitrum" ? arbitrum : polygon,
            factoryAddress: "0x9Bb60d360932171292Ad2b80839080fb6F5aBD97", // polygon, arbitrum
            gasless: true,
        },

  
  
        showThirdwebBranding: false,
        theme: 'light',
        
        /*
        appMetadata: {
          name: "GoodTether",
          description: "GoodTether",
          url: "https://gold.goodtether.com",
          //icons: ["https://gold.goodtether.com/logo.png"],
        },
        */
  
        size: 'compact',
  
        /*
        size: 'wide',
  
        welcomeScreen: {
          title: "Custom Title",
          subtitle: "Custom Subtitle",
          img: {
            src: "https://example.com/image.png",
            width: 100,
            height: 100,
          },
        },
        */
      
       locale: 'en_US',
        
      });
    };
  

    
    const [nickname, setNickname] = useState("");


    const [nicknameEdit, setNicknameEdit] = useState(false);

    const [editedNickname, setEditedNickname] = useState("");


    const [userCode, setUserCode] = useState("");





    console.log("address", address);

    useEffect(() => {
        const fetchData = async () => {

            if (!address) {
                return;
            }

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

            console.log("data", data);


            if (data.result) {
                setNickname(data.result.nickname);
                setUserCode(data.result.id);

            }
        };

        fetchData();
    }, [address]);





    console.log("nickname", nickname);
    console.log("userCode", userCode);


  




    const erc1155ContractAddress = "0xfDf9fFC5e782e11660D908E428966AF212ffE842"; // Polygon


    const contractErc1155 = getContract({
        client,
        chain: params.chain === "arbitrum" ? arbitrum : polygon,
        
        address: erc1155ContractAddress,
    });




    /* my NFTs */
    const [myNfts, setMyNfts] = useState([] as any[]);

    const [amountNft100, setAmountNft100] = useState(0);
    const [amountNft1000, setAmountNft1000] = useState(0);
    const [amountNft10000, setAmountNft10000] = useState(0);


    useEffect(() => {


        const getMyNFTs = async () => {

            try {


                const nfts = await getOwnedNFTs({
                    contract: contractErc1155,
                    start: 0,
                    count: 10,
                    address: address,
                });

                setMyNfts( nfts );

                // if id is 0n, then it is 100 TBOT
                // if id is 1n, then it is 1000 TBOT
                // if id is 2n, then it is 10000 TBOT


                nfts.forEach((nft) => {
                    if (Number(nft.id) === 0) {
                        setAmountNft100( Number(nft.quantityOwned) );
                    } else if (Number(nft.id) === 1) {
                        setAmountNft1000( Number(nft.quantityOwned) );
                    } else if (Number(nft.id) === 2) {
                        setAmountNft10000( Number(nft.quantityOwned) );
                    }
                } );


            } catch (error) {
                console.error("Error getting NFTs", error);
            }

        };

        if (address) {
            getMyNFTs();
        }

    }
    , [address, contractErc1155]);


    console.log("myNfts", myNfts);

    console.log("amountNft100", amountNft100);


    // claim NFT (ERC1155) for the user
    const [claimingNFT, setClaimingNFT] = useState(false);
    const claimNFT = async () => {

        if (claimingNFT) {
            return;
        }

        if (address === "") {
            toast.error(Please_connect_your_wallet_first);
            return;
        }

        if (confirm("TBOT NFT를 구매하시겠습니까?")) {


            setClaimingNFT(true);

            const transaction = claimTo({
                contract: contractErc1155,
                to: address,
                tokenId: 0n,
                quantity: 1n,
            });

            try {
                const result = await sendAndConfirmTransaction({
                    account: smartAccount as any,
                    transaction: transaction,
                });

                console.log("result", result);

                toast.success(Alert_NFT_minted);


                // get NFTs again
                const nfts = await getOwnedNFTs({
                    contract,
                    start: 0,
                    count: 10,
                    address: address,
                });

                setMyNfts( nfts );

                nfts.forEach((nft) => {
                    if (Number(nft.id) === 0) {
                        setAmountNft100( Number(nft.quantityOwned) );
                    } else if (Number(nft.id) === 1) {
                        setAmountNft1000( Number(nft.quantityOwned) );
                    } else if (Number(nft.id) === 2) {
                        setAmountNft10000( Number(nft.quantityOwned) );
                    }
                } );




            } catch (error) {
                console.error("Error claiming NFT", error);
            }

            setClaimingNFT(false);
            

        }

    }







    /*
          erc721ContractAddress = await deployERC721Contract({
        chain,
        client,
        account,

        //  type ERC721ContractType =
        //  | "DropERC721"
        //  | "TokenERC721"
        //  | "OpenEditionERC721";
        

        //type: "DropERC721",

        type: "TokenERC721",
        
        
        params: {
          name: "My NFT",
          description: "My NFT",
          symbol: "MYNFT",
        },

      });
      */




    console.log("address", address);



    return (

        <main className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto">

            <div className="py-0 w-full">
        

                <AppBarComponent />

                <Header />
                


                <div className="flex flex-col items-start justify-center space-y-4">

                    <div className='flex flex-row items-center gap-4'>
                        
                        <Image
                            src="/tbot.png"
                            alt="TBOT"
                            width={100}
                            height={40}
                        />
                        <span className="text-sm font-semibold text-gray-500">
                            OWIN AI 로봇 트레이딩&아카데미 센터
                        </span>
                    </div>
                    <div className='flex flex-row items-center gap-4'>
                        {/* red dot */}
                        <div className='w-4 h-4 bg-red-500 rounded-full'></div>
                        <span className="text-lg font-semibold text-blue-500">
                            AI 트레이딩 TOBOT 서비스센터 입니다.
                        </span>
                    </div>
                    <div className='flex flex-row items-center gap-2'>

                        <div className='flex flex-col gap-2'>



                            {/* AI 트레이딩 TOBOT 서비스센터 입니다. */}
                            <span className="text-xs font-semibold text-gray-800">
                                
                                TBOT 센터는 본인 계좌로 운영자금이 디파짓하여 AI트레이딩을 제공합니다. <br />
                                TBOT을 민팅을 하면 Master bot이 지원을 합니다. <br />
                                코인선물투자 개념과 트레이딩에 대한 교육을 제공합니다.
                            </span>
                        </div>

                        <Image
                            src="/icon-tbot.png"
                            alt="ChatGPT"
                            width={100}
                            height={40}
                            className='bg-zinc-100 p-2 rounded'
                        />

                        {/* balance */}
                        {/*
                        {address && (
                            <div className="text-5xl font-semibold text-blue-500">
                                {Number(balance).toFixed(2)} <span className="text-lg">USDT</span>
                            </div>
                        )}
                        */}


                        {/*
                        {!address && (

                        <ConnectButton
                        client={client}
                        wallets={wallets}

                        
                        accountAbstraction={{   
                            chain: params.chain === "arbitrum" ? arbitrum : polygon,
                            //
                            //chain: polygon,

                            //chain: arbitrum,
                            factoryAddress: "0x9Bb60d360932171292Ad2b80839080fb6F5aBD97", // polygon, arbitrum
                            gasless: true,
                        }}
                        

                        
                        theme={"light"}
                        connectModal={{
                            size: "wide",                            
                            //title: "Connect",

                        }}

                        appMetadata={
                            {
                            logoUrl: "https://gold.goodtether.com/logo.png",
                            name: "Next App",
                            url: "https://gold.goodtether.com",
                            description: "This is a Next App.",

                            }
                        }
                        />


                        )}
                        */}

                    </div>


                    {/* 서비스 설명 */}
                    {/*
                    TBOT 특징
                        1. 자금관리.
                        본인의 거래소 계정에서 직접 관리, 입출금 자류롭게 가능, 계좌 잔고 50% 이상 출금 시 서비스 중지
                        2. 계정제한.
                        - 개인당 최대 10개 TBOT 운영가능,
                        - 거래소별 최대 3개의 계정 생성 가능 (신분증 종류별 1개, 여권,주민,운전면서) .
                        3. TBOT 아카테미를 통해서 트레이딩 투자 개념을 교육시켜 드립니다.
                        - AI트레이딩 로봇이 어떻게 작동하고, 실적을 보고 관리하는 등 트레이딩 개념을 이해하고 AI트레이딩 서
                        비스를 사용 할 수 있도록 교육제공.
                        - 유저별 사용을 위한 플랫폼의 설치와 세팅도 지원.

                    리스크 고지
                        1. 투자원금 손실 가능성 있음
                        2. 과거 수익률이 미래 수익을 보장하지 않음
                        3. 높은 레버리지 거래의 위험성 인지 필요

                    FAQ
                        1. 수익 반영 주기 .
                        TBOT의 수익반영은 매일매일입니다.
                        MASTER BOT의 수익반영은 주 단위 입니다.
                        2. 본인 계좌에 인출과 마스터봇의 작동
                        거래소의 본인 계좌를 인출을 하면, Master bot의 작동은 중지합니다 .
                    */}

                    <div className='w-full  flex flex-col gap-5 '>

                        <div className='flex flex-col gap-5 '>

                            <div className='flex flex-col gap-5 '>
                                <div className='flex flex-row items-center gap-2'>
                                    {/* dot */}
                                    <div className='w-4 h-4 bg-blue-500 rounded-full'></div>
                                    <span className='text-lg font-semibold'>
                                        TBOT 특징
                                    </span>
                                </div>
                                <span className='text-sm text-gray-500'>
                                    1. 자금관리. 본인의 거래소 계정에서 직접 관리, 입출금 자류롭게 가능, 계좌 잔고 50% 이상 출금 시 서비스 중지
                                </span>
                                <span className='text-sm text-gray-500'>
                                    2. 계정제한. - 개인당 최대 10개 TBOT 운영가능, - 거래소별 최대 3개의 계정 생성 가능 (신분증 종류별 1개, 여권,주민,운전면서) .
                                </span>
                                <span className='text-sm text-gray-500'>
                                    3. TBOT 아카테미를 통해서 트레이딩 투자 개념을 교육시켜 드립니다. - AI트레이딩 로봇이 어떻게 작동하고, 실적을 보고 관리하는 등 트레이딩 개념을 이해하고 AI트레이딩 서비스를 사용 할 수 있도록 교육제공. - 유저별 사용을 위한 플랫폼의 설치와 세팅도 지원.
                                </span>
                            </div>

                            <div className='flex flex-col gap-5 '>
                                <div className='flex flex-row items-center gap-2'>
                                    {/* dot */}
                                    <div className='w-4 h-4 bg-blue-500 rounded-full'></div>
                                    <span className='text-lg font-semibold'>
                                        리스크 고지
                                    </span>
                                </div>
                                <span className='text-sm text-gray-500'>
                                    1. 투자원금 손실 가능성 있음
                                </span>
                                <span className='text-sm text-gray-500'>
                                    2. 과거 수익률이 미래 수익을 보장하지 않음
                                </span>
                                <span className='text-sm text-gray-500'>
                                    3. 높은 레버리지 거래의 위험성 인지 필요
                                </span>
                            </div>

                            <div className='flex flex-col gap-5 '>
                                <div className='flex flex-row items-center gap-2'>
                                    {/* dot */}
                                    <div className='w-4 h-4 bg-blue-500 rounded-full'></div>
                                    <span className='text-lg font-semibold'>
                                        FAQ
                                    </span>
                                </div>
                                <span className='text-sm text-gray-500'>
                                    1. 수익 반영 주기 . TBOT의 수익반영은 매일매일입니다. MASTER BOT의 수익반영은 주 단위 입니다.
                                </span>
                                <span className='text-sm text-gray-500'>
                                    2. 본인 계좌에 인출과 마스터봇의 작동 거래소의 본인 계좌를 인출을 하면, Master bot의 작동은 중지합니다 .
                                </span>
                            </div>

                        </div>

                    </div>



                    {/* event */}
                    {/*
                    EVENT 1. 100 TBOT 100명 무료!  100-100-100 이벤트 

                    > 100 TBOT을 무료로 제공합니다. 
                    1. 100 TBOT을 무료 구매하고, 
                    2. HTX를 가입하면  HTX 본인계죄로 100 USDT를 무상으로 지급 !
                    3. 100 MASTER BOT 무료 민팅 !
                    */}
                    {/* impact text */}
                    <div className='w-full flex flex-col gap-5 '>
                            
                            <div className='flex flex-col gap-5
                                border border-gray-300 p-4 rounded-lg bg-gray-100
                            '>
                                <div className='flex flex-row items-center gap-2'>
                                    {/* dot */}
                                    <div className='w-4 h-4 bg-red-500 rounded-full'></div>
                                    <span className='text-lg font-semibold text-red-500'>
                                        EVENT 1. 100 TBOT 100명 무료!  100-100-100 이벤트
                                    </span>
                                </div>
                                <span className='text-sm text-gray-800
                                    font-semibold
                                    bg-yellow-200 p-2 rounded-lg
                                '>
                                    * 100 TBOT을 무료로 제공합니다.
                                </span>

                                <span className='text-sm text-green-800
                                    font-semibold
                                    bg-yellow-200 p-2 rounded-lg
                                '>
                                    1. 100 TBOT을 무료 구매하고, 
                                </span>
                                <span className='text-sm text-green-800
                                    font-semibold
                                    bg-yellow-200 p-2 rounded-lg
                                '>
                                    2. HTX를 가입하면  HTX 본인계죄로 100 USDT를 무상으로 지급 !
                                </span>
                                <span className='text-sm text-green-800
                                    font-semibold
                                    bg-yellow-200 p-2 rounded-lg
                                '>
                                    3. 100 MASTER BOT 무료 민팅 !
                                </span>
                            </div>

                    </div>

                    <div className='w-full flex flex-col gap-5 mt-5'>
                        {/* live icon */}
                        {address ? (
                            <div className='flex flex-row items-center gap-2'>
                                <Image
                                    src="/icon-wallet-live.gif"
                                    alt="Live"
                                    width={50}
                                    height={50}
                                />
                                <span className='text-lg font-semibold text-blue-500'>
                                    {My_Nickname}: {nickname}
                                </span>
                            </div>
                        ) : (
                            <div className='flex flex-col items-center gap-2'>
                                
                                <ConnectButton
                                    client={client}
                                    wallets={wallets}
                                    theme={"light"}
                                    accountAbstraction={{   
                                        chain: params.chain === "arbitrum" ? arbitrum : polygon,
                                        factoryAddress: "0x9Bb60d360932171292Ad2b80839080fb6F5aBD97", // polygon, arbitrum
                                        gasless: true,
                                    }}

                                    connectModal={{
                                        size: "wide",
                                    }}
                                    appMetadata={
                                        {
                                        logoUrl: "https://gold.goodtether.com/logo.png",
                                        name: "Next App",
                                        url: "https://gold.goodtether.com",
                                        description: "This is a Next App.",
                                        }
                                    }
                                />
                                


                                <button
                                    onClick={handleConnect}
                                    className="w-full bg-zinc-800 text-white px-4 py-2 rounded-lg hover:bg-zinc-900"
                                >
                                <div className="flex flex-row justify-center items-center gap-2">
                                    <Image
                                        src={thirdwebIcon}
                                        alt="Thirdweb"
                                        width={20}
                                        height={20}
                                        className="rounded-lg w-10 h-10"
                                    />
                                    <span>Sign in with OWIN Magic Wallet</span>
                                </div>
                                </button>


                                <span className='text-xs font-semibold text-red-500'>
                                    {Please_connect_your_wallet_first}
                                </span>
                            </div>
                        )}
                    </div>

     

                 


                    {/* TBOT Image */}
                    {/*
                    100 TBOT for HTX
                    1,000 TBOT for OKEX
                    10,000 TBOT for BYBIT
                    */}

                    <div className='w-full flex flex-col gap-5 '> 

                  
                        <div className='flex flex-col xl:flex-row gap-5 items-center xl:items-start justify-between border border-gray-300 p-4 rounded-lg'>
                            
                            <div className='flex flex-row items-center gap-2'>
                                {/* dot */}
                                <div className='w-4 h-4 bg-blue-500 rounded-full'></div>
                                <span className='text-lg font-semibold'>
                                    100 TBOT for HTX
                                </span>
                            </div>

                            <div className='flex flex-col items-center gap-2
                                border border-gray-300 p-4 rounded-lg
                            '>
                                {/* 이벤트기간동안 Free */}
                                <span className='
                                    text-sm font-semibold text-green-500
                                    bg-yellow-200 p-2 rounded-lg
                                '>
                                    이벤트기간동안 Free
                                </span>
                                <div className='flex flex-row items-center gap-2'>
                                    <Image
                                        src="/tbot100.png"
                                        alt="TBOT"
                                        width={200}
                                        height={200}
                                    />
                                    <Image
                                        src="/logo-exchange-htx.png"
                                        alt="HTX"
                                        width={50}
                                        height={50}
                                    />
                                </div>
                                {/* button for buy */}
                                {/* 121 USDT BUY */}
                                <button
                                    className={`${claimingNFT ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-zinc-100'} p-2 rounded text-lg font-semibold`}
                                    disabled={claimingNFT}
                                    // mintNFT
                                    onClick={() => claimNFT()}
                                >

                                    <div className='flex flex-row items-center gap-2'>
                                        <Image
                                            src="/token-usdt-icon.png"
                                            alt="USDT"
                                            width={20}
                                            height={20}
                                        />
                                        <span className='text-lg font-semibold'>
                                            121 USDT BUY
                                        </span>
                                    </div>


                                </button>

                                {/* claimingNFT */}
                                {claimingNFT && (
                                    <span className='text-sm font-semibold text-blue-500'>
                                        {Minting_NFT}
                                    </span>
                                )}

                                {/* myNfts */}
                                <div className='flex flex-row items-center gap-2'>
                                    <span className='text-5xl font-semibold
                                        text-blue-500
                                    '>
                                        {amountNft100}
                                    </span>
                                    <span className='text-lg font-semibold'>
                                        TBOT
                                    </span>
                                </div>


                                {/* if myImages.length > 0, then disable */}
                                {/*
                                <button
                                    
                                    disabled={
                                        !address || !prompt || loading
                                        || myImages.length > 0
                                    }

                                    onClick={getImages}
                                    className={` ${
                                        !address || !prompt || loading
                                        || myImages.length > 0

                                         ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-zinc-100'} p-2 rounded
                                        text-lg font-semibold w-full
                                        `}
                                >
                                    {loading ? "Loading..." : "Generate TBOT"}
                                </button>

                                {myImages.length > 0 && (
                                    <Image
                                        src={myImages[0]?.image || "/logo-chatgpt.png"}
                                        alt="TBOT"
                                        width={200}
                                        height={200}
                                    />
                                )}
                                
                                */}



                            </div>
                            {/*
                            AI 트레이딩 100 TBOT
                                • AI 자동매매 트레이딩 서비스 이용권 NFT 입니다.
                                • HTX 거래소 전용

                            계정 운영 방식
                                • 본인 거래소 계정에서 직접 자금 관리
                                • 최소 운영자금: 100 USDT
                                • 자유로운 입출금 가능
                                • 계좌 잔고 50% 이상 출금 시 서비스 일시 중지

                            리스크 고지
                                - 디지털자산 투자에는 원금 손실 위험이 있습니다
                                - 과거 수익률이 미래 수익을 보장하지 않 습니다
                                - 높은 레버리지 거래는 큰 손실을 초래할 수 있습니다

                            Master BOT 혜택
                                • 거래소 리베이트 프로그램 참여 자격 부여
                                • 거래 실적에 따른 변동 리워드 제공
                                • 주 단위 리워드 정산
                                • 추가 지원AI 트레이딩 시스템 운영 교육
                            */}
                            <div className='flex flex-col gap-2'>

                                <span className='text-lg font-semibold text-blue-500'>
                                    AI 트레이딩 100 TBOT
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • AI 자동매매 트레이딩 서비스 이용권 NFT 입니다.
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • HTX 거래소 전용
                                </span>

                                <span className='text-lg font-semibold text-blue-500 mt-2'>
                                    계정 운영 방식
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 본인 거래소 계정에서 직접 자금 관리
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 최소 운영자금: 100 USDT
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 자유로운 입출금 가능
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 계좌 잔고 50% 이상 출금 시 서비스 일시 중지
                                </span>

                                <span className='text-lg font-semibold text-blue-500 mt-2'>
                                    리스크 고지
                                </span>
                                <span className='text-sm text-gray-500'>
                                    - 디지털자산 투자에는 원금 손실 위험이 있습니다
                                </span>
                                <span className='text-sm text-gray-500'>
                                    - 과거 수익률이 미래 수익을 보장하지 않 습니다
                                </span>
                                <span className='text-sm text-gray-500'>
                                    - 높은 레버리지 거래는 큰 손실을 초래할 수 있습니다
                                </span>

                                <span className='text-lg font-semibold text-blue-500 mt-2'>
                                    Master BOT 혜택
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 거래소 리베이트 프로그램 참여 자격 부여
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 거래 실적에 따른 변동 리워드 제공
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 주 단위 리워드 정산
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 추가 지원AI 트레이딩 시스템 운영 교육
                                </span>

                            </div>
                                
                        </div>

                        {/*
                        Ai 트레이딩 1000 TBOT
                        • AI 자동매매 트레이딩 서비스 이용권
                        NFT 입니다.
                        • HTX 거래소 전용
                        계정 운영 방식
                        • 본인 거래소 계정에서 직접 자금 관리
                        • 최소 운영자금: 100 USDT
                        • 자유로운 입출금 가능
                        • 계좌 잔고 50% 이상 출금 시 서비스 일시
                        중지
                        리스크 고지
                        - 디지털자산 투자에는 원금 손실 위험이
                        있습니다
                        - 과거 수익률이 미래 수익을 보장하지 않
                        습니다
                        - 높은 레버리지 거래는 큰 손실을 초래할
                        수 있습니다
                        Master BOT 혜택
                        •거래소 리베이트 프로그램 참여 자격 부여
                        •거래 실적에 따른 변동 리워드 제공
                        •주 단위 리워드 정산
                        •추가 지원AI 트레이딩 시스템 운영 교육
                        */}
                    </div>

                    <div className='w-full flex flex-col gap-5 '> 

                        <div className='flex flex-col xl:flex-row gap-5 items-center xl:items-start justify-between border border-gray-300 p-4 rounded-lg'>
                            <div className='flex flex-row items-center gap-2'>
                                {/* dot */}
                                <div className='w-4 h-4 bg-blue-500 rounded-full'></div>
                                <span className='text-lg font-semibold'>
                                    1000 TBOT for OKEX
                                </span>
                            </div>
                            <div className='flex flex-col items-center gap-2
                                border border-gray-300 p-4 rounded-lg
                            '>
                                <div className='flex flex-row items-center gap-2'>
                                    <Image
                                        src="/tbot.png"
                                        alt="TBOT"
                                        width={200}
                                        height={200}
                                    />
                                    <Image
                                        src="/logo-exchange-okex.png"
                                        alt="HTX"
                                        width={50}
                                        height={50}
                                    />
                                </div>
                                {/* button for buy */}
                                {/* 121 USDT BUY */}
                                <button
                                    className='bg-blue-500 text-zinc-100 p-2 rounded text-lg font-semibold'
                                >
                                    1,210 USDT BUY
                                </button>
                            </div>

                            <div className='flex flex-col gap-2'>

                                <span className='text-lg font-semibold text-blue-500'>
                                    AI 트레이딩 1000 TBOT
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • AI 자동매매 트레이딩 서비스 이용권 NFT 입니다.
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • OKEX 거래소 전용
                                </span>

                                <span className='text-lg font-semibold text-blue-500 mt-2'>
                                    계정 운영 방식
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 본인 거래소 계정에서 직접 자금 관리
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 최소 운영자금: 100 USDT
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 자유로운 입출금 가능
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 계좌 잔고 50% 이상 출금 시 서비스 일시 중지
                                </span>

                                <span className='text-lg font-semibold text-blue-500 mt-2'>
                                    리스크 고지
                                </span>
                                <span className='text-sm text-gray-500'>
                                    - 디지털자산 투자에는 원금 손실 위험이 있습니다
                                </span>
                                <span className='text-sm text-gray-500'>
                                    - 과거 수익률이 미래 수익을 보장하지 않 습니다
                                </span>
                                <span className='text-sm text-gray-500'>
                                    - 높은 레버리지 거래는 큰 손실을 초래할 수 있습니다
                                </span>

                                <span className='text-lg font-semibold text-blue-500 mt-2'>
                                    Master BOT 혜택
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 거래소 리베이트 프로그램 참여 자격 부여
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 거래 실적에 따른 변동 리워드 제공
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 주 단위 리워드 정산
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 추가 지원AI 트레이딩 시스템 운영 교육
                                </span>

                            </div>

                        </div>


                        {/*
                        Ai 트레이딩 1000 TBOT
                        • AI 자동매매 트레이딩 서비스 이용권
                        NFT 입니다.
                        • HTX 거래소 전용
                        계정 운영 방식
                        • 본인 거래소 계정에서 직접 자금 관리
                        • 최소 운영자금: 100 USDT
                        • 자유로운 입출금 가능
                        • 계좌 잔고 50% 이상 출금 시 서비스 일시
                        중지
                        리스크 고지
                        - 디지털자산 투자에는 원금 손실 위험이
                        있습니다
                        - 과거 수익률이 미래 수익을 보장하지 않
                        습니다
                        - 높은 레버리지 거래는 큰 손실을 초래할
                        수 있습니다
                        Master BOT 혜택
                        •거래소 리베이트 프로그램 참여 자격 부여
                        •거래 실적에 따른 변동 리워드 제공
                        •주 단위 리워드 정산
                        •추가 지원AI 트레이딩 시스템 운영 교육
                        */}

                        <div className='flex flex-col xl:flex-row gap-5 items-center xl:items-start justify-between border border-gray-300 p-4 rounded-lg'>
                            <div className='flex flex-row items-center gap-2'>
                                {/* dot */}
                                <div className='w-4 h-4 bg-blue-500 rounded-full'></div>
                                <span className='text-lg font-semibold'>
                                    10000 TBOT for BYBIT
                                </span>
                            </div>
                            <div className='flex flex-col items-center gap-2
                                border border-gray-300 p-4 rounded-lg
                            '>
                                <div className='flex flex-row items-center gap-2'>
                                    <Image
                                        src="/tbot.png"
                                        alt="TBOT"
                                        width={200}
                                        height={200}
                                    />
                                    <Image
                                        src="/logo-exchange-bybit.webp"
                                        alt="HTX"
                                        width={50}
                                        height={50}
                                    />
                                </div>
                                {/* button for buy */}
                                {/* 121 USDT BUY */}
                                <button
                                    className='bg-blue-500 text-zinc-100 p-2 rounded text-lg font-semibold'
                                >
                                    12,100 USDT BUY
                                </button>
                            </div>

                            <div className='flex flex-col gap-2'>

                                <span className='text-lg font-semibold text-blue-500'>
                                    AI 트레이딩 10000 TBOT
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • AI 자동매매 트레이딩 서비스 이용권 NFT 입니다.
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • BYBIT 거래소 전용
                                </span>

                                <span className='text-lg font-semibold text-blue-500 mt-2'>
                                    계정 운영 방식
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 본인 거래소 계정에서 직접 자금 관리
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 최소 운영자금: 100 USDT
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 자유로운 입출금 가능
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 계좌 잔고 50% 이상 출금 시 서비스 일시 중지
                                </span>

                                <span className='text-lg font-semibold text-blue-500 mt-2'>
                                    리스크 고지
                                </span>
                                <span className='text-sm text-gray-500'>
                                    - 디지털자산 투자에는 원금 손실 위험이 있습니다
                                </span>
                                <span className='text-sm text-gray-500'>
                                    - 과거 수익률이 미래 수익을 보장하지 않 습니다
                                </span>
                                <span className='text-sm text-gray-500'>
                                    - 높은 레버리지 거래는 큰 손실을 초래할 수 있습니다
                                </span>

                                <span className='text-lg font-semibold text-blue-500 mt-2'>
                                    Master BOT 혜택
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 거래소 리베이트 프로그램 참여 자격 부여
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 거래 실적에 따른 변동 리워드 제공
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 주 단위 리워드 정산
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 추가 지원AI 트레이딩 시스템 운영 교육
                                </span>

                            </div>

                        </div>


                    </div>


                </div>

            </div>

        </main>

    );

}

          




function Header() {

    const router = useRouter();
  
  
    return (
      <header className="flex flex-col items-center mb-5 md:mb-10">
  
        {/* header menu */}
        <div className="w-full flex flex-row justify-between items-center gap-2
          bg-green-500 p-4 rounded-lg mb-5
        ">
            {/* logo */}
            <button
                onClick={() => {
                    router.push("/");
                }}
            >            
                <div className="flex flex-row gap-2 items-center">
                    <Image
                    src="/circle-logo.webp"
                    alt="Circle Logo"
                    width={35}
                    height={35}
                    className="rounded-full w-10 h-10 xl:w-14 xl:h-14"
                    />
                    <span className="text-lg xl:text-3xl text-gray-800 font-semibold">
                    OWIN
                    </span>
                </div>
            </button>

          {/* menu */}
          {/* COIN, NFT, DEFI */}
          <div className="flex flex-row gap-2 items-center">
            <button
                onClick={() => {
  
                  /*
                  router.push(
                    "/" + params.lang + "/" + params.chain + "/send-token/?wallet=" + wallet + "&token=CAMT"
                  );
                  */
  
                }}
              className="text-gray-600 hover:underline text-xs xl:text-lg"
            >
              WALLET
            </button>
            <button
              onClick={() => {
                //console.log("chat");
              }}
              className="text-gray-600 hover:underline text-xs xl:text-lg"
            >
              TRADE
            </button>
            <button
              onClick={() => {
                router.push(
                    "/kr/polygon/tbot"
                  );
              }}
              className="text-gray-600 hover:underline text-xs xl:text-lg"
            >
              TBOT
            </button>
            <button
              onClick={() => {
                router.push('/kr/polygon/profile-settings');
              }}
              className="text-gray-600 hover:underline text-xs xl:text-lg"
            >
              SETTINGS
            </button>
          </div>
        </div>
        
      </header>
    );
  }