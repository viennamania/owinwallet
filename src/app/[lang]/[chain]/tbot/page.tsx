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
  
    getTotalClaimedSupply,
  
  
  } from "thirdweb/extensions/erc721";
import { Alert } from '@mui/material';



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




    
    const [nickname, setNickname] = useState("");


    const [nicknameEdit, setNicknameEdit] = useState(false);

    const [editedNickname, setEditedNickname] = useState("");


    const [userCode, setUserCode] = useState("");




    const [erc721ContractAddress, setErc721ContractAddress] = useState("");



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

                
                
                
                /////////////////setErc721ContractAddress(data.result.erc721ContractAddress);


            }
        };

        fetchData();
    }, [address]);


    console.log("erc721ContractAddress", erc721ContractAddress);





    const setUserData = async () => {


        // check nickname length and alphanumeric
        //if (nickname.length < 5 || nickname.length > 10) {

        if (editedNickname.length < 5 || editedNickname.length > 10) {

            toast.error('Nickname should be at least 5 characters and at most 10 characters');
            return;
        }
        
        ///if (!/^[a-z0-9]*$/.test(nickname)) {
        if (!/^[a-z0-9]*$/.test(editedNickname)) {
            toast.error('Nickname should be alphanumeric and lowercase');
            return;
        }

        if (nicknameEdit) {


            const response = await fetch("/api/user/updateUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                    
                    //nickname: nickname,
                    nickname: editedNickname,

                }),
            });

            const data = await response.json();

            console.log("updateUser data", data);

            if (data.result) {

                setUserCode(data.result.id);
                setNickname(data.result.nickname);

                setNicknameEdit(false);
                setEditedNickname('');

                toast.success('Nickname saved');

            } else {
                toast.error('Error saving nickname');
            }


        } else {

            const response = await fetch("/api/user/setUserVerified", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                    
                    //nickname: nickname,
                    nickname: editedNickname,

                    mobile: phoneNumber,
                }),
            });

            const data = await response.json();

            ///console.log("data", data);

            if (data.result) {

                setUserCode(data.result.id);
                setNickname(data.result.nickname);

                setNicknameEdit(false);
                setEditedNickname('');

                toast.success('Nickname saved');

            } else {
                toast.error('Error saving nickname');
            }
        }


        

        
    }


    console.log("nickname", nickname);
    console.log("userCode", userCode);


    const [agreementCopy, setAgreementCopy] = useState(false);





    const [prompt, setPrompt] = useState(
        "Create a character of the future si-fi bot. Draw a face completely like a robot. Draw coolly in a dramatic style. The text 'TBOT' is displayed in a retro, distressed style, with each letter in a different color, exuding a sense of nostalgia."
    );


    const [number, setNumber] = useState(1);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
  
  
    // check if prompt is real picture
    const [checkIsRealPicture, setCheckIsRealPicture] = useState(true);
  
  
  
    function getImages() {
  
  
      //console.log("prompt=", prompt);
  
      //if (token != "" && prompt != "") {
  
      if (prompt != "") {
  
  
  
        setError(false);
        setLoading(true);

        /*
        axios
          
          ////.post(`/api/images?t=${token}&p=${prompt}&n=${number}`)
  
          .post(`/api/ai/images?p=${prompt}&n=${number}&userid=${address}&real=${checkIsRealPicture}`)
  
  
          .then((res) => {
  
            //console.log("res=", res);
  
            setResults(res.data.result);
            setLoading(false);
          })
          .catch((err) => {
  
            setLoading(false);
            setError(true);
  
            
            console.log("err=", err);
  
   
  
          });
        */

        async function fetchData() {

            const response = await fetch("/api/ai/images?p=" + prompt + "&n=" + number + "&userid=" + address + "&real=" + checkIsRealPicture, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            });

            const data = await response.json();

            console.log("data", data);

            setResults(data.result);

            setLoading(false);

        }

        fetchData();

  
  
      } else {
        
        setError(true);
  
      }
    }
  
    //const [type, setType] = useState("webp");
    const [type, setType] = useState("png");
  


    ///console.log("results", results);


    const [myImages, setMyImages] = useState([]);
    // loading my images
    const [loadingMyImages, setLoadingMyImages] = useState(false);


    useEffect(() => {
        async function fetchData() {
            
            setLoadingMyImages(true);

            const response = await fetch("/api/ai/getImages?userid=" + address, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            ///console.log("getImages data", data);

            setMyImages(data.images || []);

            setLoadingMyImages(false);
        }

        fetchData();
    }, [address]);



    const [loadingDownload, setLoadingDownload] = useState(false);

    //function download(url: string) {

    // aync function download(url: string) {

    const download = async (url: string) => {
  
      setLoadingDownload(true);


      // /api/download`

        const response = await fetch("/api/ai/download", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: prompt,
                url: url,
                type: type,
                userid: address,
            }),
        });

        /*
        if (!response.ok) {
            console.log("error", response);

            toast.success('Already downloaded');

            setLoadingDownload(false);
            return;
        }
        */

        const data = await response.json();

        if (data.error) {
            console.log("error", data.error);

            toast.error(data.error);

            setLoadingDownload(false);
            return;
        }




        //console.log("data", data);
        /*
        const link = document.createElement("a");

        link.href = data.result;

        link.download = `${prompt}.${type.toLowerCase()}`;

        link.click();
        */
        

        toast.success(Alert_download_image_success);

        // get my images from api
        const response2 = await fetch("/api/ai/getImages?userid=" + address, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data2 = await response2.json();

        //console.log("data2", data2);

        setMyImages(data2.images || []);

        setLoadingDownload(false);
  
    }


    // mint nft array of images
    const [loadingMintNFTs, setLoadingMintNFTs] = useState([] as boolean[]);
    useEffect(() => {
        setLoadingMintNFTs(
            new Array(myImages.length).fill(false)
        );
    } , [myImages]);
    


    const mintNFT = async (url: string, prompt:string, index: number) => {


        if (!smartAccount) {
            return;
        }


        if (confirm("Are you sure you want to mint this NFT?")) {


            setLoadingMintNFTs(
                loadingMintNFTs.map((value, i) => {
                    return i === index ? true : value;
                }
            ));
            

            const contract = getContract({
                client,
                chain: params.chain === "arbitrum" ? arbitrum : polygon,
                
                address: erc721ContractAddress,


            });


            // generate image
            const image = url;

            const transactionMintTo = mintTo({
                contract,
                to: address,
                nft: {
                name: "NFT",
                description: prompt,
                image: image,
                animation_url: image,

                attributes: [
                    {
                    trait_type: "CreatorName",
                    value: nickname,
                    },
                ],

                },
            });



            const sendData = await sendAndConfirmTransaction({
                transaction: transactionMintTo,
                account: smartAccount,
            });

            console.log("sendData", sendData);


            if (sendData) {
                // update image with erc721 contract address and token id

                // get the token id
                const nextTokenId = await nextTokenIdToMint({
                    contract: contract,
                });

                const tokenid = parseInt(nextTokenId.toString(), 10) - 1;



                const response = await fetch("/api/ai/updateImageNFT", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        image: url,
                        erc721ContractAddress: erc721ContractAddress,
                        tokenid: tokenid,
                    }),
                });

                // update my images
                const response2 = await fetch("/api/ai/getImages?userid=" + address, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data2 = await response2.json();

                //console.log("data2", data2);

                setMyImages(data2.images || []);

            }   



            toast.success(Alert_NFT_minted);

            setLoadingMintNFTs(
                loadingMintNFTs.map((value, i) => {
                    return i === index ? false : value;
                }
            ));


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


    const [loadingDeployERC721Contract, setLoadingDeployERC721Contract] = useState(false);

    const deployERC721 = async () => {

        if (!smartAccount) {
            return;
        }


        if (confirm("Are you sure you want to make an OpenSea collection?")) {

            try {

                setLoadingDeployERC721Contract(true);

                const erc721ContractAddress = await deployERC721Contract({
                    chain: params.chain === "arbitrum" ? arbitrum : polygon,
                    client: client,
                    account: smartAccount,
                    type: "TokenERC721",
                    params: {
                        name: "My NFT",
                        description: "My NFT",
                        symbol: "MYNFT",
                    },
                });

                console.log("erc721ContractAddress", erc721ContractAddress);

                if (erc721ContractAddress) {


                    const contract = getContract({
                        client,
                        chain: params.chain === "arbitrum" ? arbitrum : polygon,
                        address: erc721ContractAddress,
                    });


                    // generate image
                    const image = "https://next.unove.space/logo-chatgpt.png";

                    const transactionMintTo = mintTo({
                        contract,
                        to: address,
                        nft: {
                        name: "NFT",
                        description: "NFT",
                        image: image,
                        animation_url: image,

                        attributes: [
                            {
                            trait_type: "CreatorName",
                            value: nickname,
                            },
                        ],

                        },
                    });



                    const sendData = await sendAndConfirmTransaction({
                        transaction: transactionMintTo,
                        account: smartAccount,
                    });





                    // update the user with the erc721 contract address

                    const response = await fetch("/api/user/updateErc721ContractAddress", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            walletAddress: address,
                            erc721ContractAddress: erc721ContractAddress,
                        }),
                    });

                    setErc721ContractAddress(erc721ContractAddress);


                    toast.success(Alert_OpenSea_Collection_made);
                } else {
                    toast.error('Error deploying ERC721 contract');
                }

                setLoadingDeployERC721Contract(false);

            } catch (error) {

                console.error("Error deploying ERC721 contract", error);
                setLoadingDeployERC721Contract(false);

            }

        }



    }



    // remove image

    const removeImage = async (url: string) => {

        if (confirm("Are you sure you want to delete this image?")) {

            const response = await fetch("/api/ai/removeOneImage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image: url,
                }),
            });

            const data = await response.json();

            console.log("data", data);

            // get my images from api
            const response2 = await fetch("/api/ai/getImages?userid=" + address, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data2 = await response2.json();

            //console.log("data2", data2);

            setMyImages(data2.images || []);

        }

    }







    return (

        <main className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto">

            <div className="py-0 w-full">
        

                <AppBarComponent />

                <Header />
                


                <div className="flex flex-col items-start justify-center space-y-4">

                    <div className='flex flex-row items-center space-x-4'>
                        <Image
                            src="/logo-chatgpt.png"
                            alt="ChatGPT"
                            width={40}
                            height={40}
                            className='bg-zinc-100 p-2 rounded'
                        />
                        <div className="text-2xl font-semibold">
                            TBOT
                        </div>
                        {/* balance */}
                        {address && (
                            <div className="text-5xl font-semibold text-white">
                                {Number(balance).toFixed(2)} <span className="text-lg">USDT</span>
                            </div>
                        )}



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
                                border border-gray-300 p-4 rounded-lg
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
                                <div className='flex flex-row items-center gap-2'>
                                    <Image
                                        src="/logo-tbot.webp"
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
                                    className='bg-blue-500 text-zinc-100 p-2 rounded text-lg font-semibold'
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

                                        {/* 이벤트기간동안 Free */}
                                        <span className='text-sm font-semibold  bg-yellow-200 text-gray-800 p-1 rounded-lg'>
                                            이벤트기간동안 Free
                                        </span>

                                    </div>


                                </button>


                                <button
                                    disabled={!address || !prompt || loading}
                                    onClick={getImages}
                                    className={` ${!address || !prompt || loading ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-zinc-100'} p-2 rounded
                                        text-lg font-semibold w-full
                                        `}
                                >
                                    {loading ? "Loading..." : "Generate TBOT"}
                                </button>




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
                                        src="/logo-tbot.webp"
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
                                        src="/logo-tbot.webp"
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



                    <div className=' w-full  flex flex-col gap-5 '>


                        {/* input prompt */}
                        <div className='flex flex-col xl:flex-row gap-5 items-center justify-between border border-gray-300 p-4 rounded-lg'>

                            <div className='flex flex-row items-center gap-2'>
                                {/*
                                <input
                                    disabled={!address || loading}
                                    type="text"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="prompt"
                                    className={` ${!address || loading ? 'bg-gray-300 text-gray-500' : 'bg-zinc-100 text-zinc-800'} p-2 rounded
                                        text-lg w-full
                                        `}
                                />
                                */}
                                {/* text area for prompt */}
                                <textarea
                                    disabled={!address || loading}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder={Prompt_input_placeholder}
                                    className={` ${!address || loading ? 'bg-gray-300 text-gray-500' : 'bg-zinc-100 text-zinc-800'} p-2 rounded
                                        text-lg w-full hidden
                                        `}
                                />


                                {/* cehck box for real picture */}
                                <input
                                    type="checkbox"
                                    checked={checkIsRealPicture}
                                    onChange={(e) => setCheckIsRealPicture(e.target.checked)}
                                    className='p-2 hidden'
                                />
                                <div className='hidden'>
                                    {Real_prompt}
                                </div>

                                {/*
                                <button
                                    disabled={!address || !prompt || loading}
                                    onClick={getImages}
                                    className={` ${!address || !prompt || loading ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-zinc-100'} p-2 rounded
                                        text-lg font-semibold w-32 h-12
                                        `}
                                >
                                    이미지 생성
                                </button>
                                */}
       

                                {/* Reset Button */}
                                <button
                                    disabled={!address || loading}
                                    onClick={() => {
                                        setPrompt("");
                                        setResults([]);
                                        setCheckIsRealPicture(false);
                                    }}
                                    className={` ${!address || loading ? 'bg-gray-300 text-gray-500' : 'bg-red-500 text-zinc-100'} p-2 rounded
                                        text-lg font-semibold w-32 h-12 hidden
                                        `}
                                >
                                    초기화
                                </button>


                            </div>

                            

                            <div className='mt-10 xl:mt-0 flex flex-row items-center gap-2'>
                            
                                { loading && (
                                    <div className='flex flex-col items-center gap-2'>
                                        <Image
                                            src="/chatbot-loading.gif"
                                            alt="loading"
                                            width={400}
                                            height={400}

                                        />
                                        <span>
                                            이미지 생성중...
                                        </span>
                                    </div>
                                )}

                                {!loading && results.length > 0 && results?.map((result : any, index : number) => (

                                    <div key={index} className='flex flex-col gap-2 items-center justify-between '>
                                        
                                        <div className='flex flex-col items-center gap-2 border border-gray-300 rounded-lg p-4'>
                                            
                                            <div className='flex flex-col items-center gap-2'>
                                            
                                                <Image
                                                    src={result.url}
                                                    alt={result.url}
                                                    width={500}
                                                    height={500}
                                                />

                                                <span className='hidden'>
                                                    {prompt}
                                                </span>
                                            </div>

                                            {loadingDownload ? (
                                                <div className='flex flex-col items-center gap-2'>
                                                    <Image
                                                        src="/chatbot-loading.gif"
                                                        alt="loading"
                                                        width={100}
                                                        height={100}
                                                    />
                                                    <span>
                                                        이미지 다운로드중...
                                                    </span>
                                                </div>
                                            ) : (
                                                <button
                                                    disabled={loadingDownload}
                                                    onClick={() => download(result.url)}
                                                    className={` ${loadingDownload ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-zinc-100'} p-2 rounded
                                                        text-lg font-semibold m-2
                                                        `}
                                                >
                                                    이미지 다운로드
                                                </button>
                                            )}

                                        </div>


                                    </div>
                                ))}

                            </div>

                       

                        </div>


                        {/* check erc721 contract address */}
                        {/* if not set, deploy */}

                        {/*
                        {userCode && !erc721ContractAddress && (
                            <div className='mt-10 flex flex-col gap-5 items-center justify-center'>

                                {loadingDeployERC721Contract ? (
                                    <div className='flex flex-row items-center gap-2'>
                                        <Image
                                            src="/chatbot-loading.gif"
                                            alt="loading"
                                            width={100}
                                            height={100}
                                        />
                                        <span>
                                            컬렉션 생성중...
                                        </span>
                                    </div>
                                ) : (
                                    <div className='flex flex-col gap-2 items-center justify-between '>
                                        <span className='text-sm text-gray-500'>
                                            컬렉션을 만들어서 오픈씨에 등록하세요.
                                        </span>
                                        <button
                                            disabled={loadingDeployERC721Contract}
                                            onClick={deployERC721}
                                            className={` ${loadingDeployERC721Contract ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-zinc-100'} p-2 rounded
                                                text-lg font-semibold m-2
                                                `}
                                        >
                                            {loadingDeployERC721Contract ? "컬렉션 생성중..." : "컬렉션 생성"}
                                        </button>
                                    </div>

                                )}

                            </div>
                        )}
   
                        {erc721ContractAddress && (
                            <div className='mt-10 flex flex-col gap-5 items-center justify-center text-sm'>
                                <div>
                                    컬렉션 주소: {erc721ContractAddress}
                                </div>
                                <button
                                    onClick={() => window.open("https://opensea.io/assets/matic/" + erc721ContractAddress)}

                                    className='hover:underline'
                                >
                                    <div className='flex flex-row items-center gap-2'>
                                    
                                        <Image
                                            src="/logo-opensea.png"
                                            alt="opensea"
                                            width={100}
                                            height={100}
                                        />
                                        <span className='ml-2'>
                                            오픈씨 컬렉션
                                        </span>
                                    </div>
                                    
                                </button>
                            </div>
                        )}
                        */}
                        



                        {/* my images */}

                        <div className="mt-10 w-full grid gap-4 lg:grid-cols-2 xl:grid-cols-3 justify-center ">



                            {loadingMyImages && (

                                <div className='flex flex-col items-center justify-center'>
                                    <Image
                                        src="/chatbot-loading.gif"
                                        alt="loading"
                                        width={100}
                                        height={100}
                                    />
                                    <span>
                                        이미지 로딩중...
                                    </span>
                                </div>

                            )}

                            {!loadingMyImages && myImages.length > 0 && myImages?.map((result : any, index : number) => (

                                <div key={index} className='flex flex-col gap-2 items-center justify-between '>
    
                                    <div className='flex flex-col items-center gap-2 border border-gray-300 rounded-lg p-4'>
                                        
                                        <div className='flex flex-col items-center gap-2'>
                                            <Image
                                                src={result.image}
                                                alt={result.image}
                                                width={400}
                                                height={400}
                                                className='rounded-lg'
                                            />
                                            <span>
                                                {/*result.prompt*/}
                                            </span>
                                        </div>

                                        {/* mint nft button */}
                                        {result.erc721ContractAddress ? (

                                            <button
                                                // open opensea
                                                onClick={() => window.open("https://opensea.io/assets/matic/" + result.erc721ContractAddress + "/" + result.tokenid)}
                                                className='hover:underline'
                                            >
                                                <div className='flex flex-row items-center gap-2'>
                                                    {/* verify image */}
                                                    <Image
                                                        src="/verified.png"
                                                        alt="verified"
                                                        width={20}
                                                        height={20}
                                                    />
                                                    {/* updatedAt */}
                                                    <span>
                                                        {new Date(result.updatedAt).toLocaleString()}
                                                    </span>
                                                    <Image
                                                        src="/logo-opensea.png"
                                                        alt="opensea"
                                                        width={50}
                                                        height={50}
                                                    />
                                                    <span>
                                                        OpenSea
                                                    </span>
                                                </div>
                                            </button>
                                        
                                        ) : (
                                            <>
                                                {loadingMintNFTs[index] ? (
                                                    <div className='flex flex-row items-center gap-2'>
                                                        <Image
                                                            src="/chatbot-loading.gif"
                                                            alt="loading"
                                                            width={100}
                                                            height={100}
                                                        />
                                                        <span>
                                                            {/*Minting_NFT*/}
                                                            NFT 발행중...
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className='flex flex-row items-center gap-2'>
                                                        <button
                                                            disabled={loadingMintNFTs[index]}
                                                            onClick={() => mintNFT(
                                                                result.image,
                                                                result.prompt,
                                                                index
                                                            )}
                                                            className={` ${loadingMintNFTs[index] ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-zinc-100'} p-2 rounded
                                                                text-lg font-semibold m-2
                                                                `}
                                                        >
                                                            {loadingMintNFTs[index] ? "NFT 발행중..." : "NFT 발행"}
                                                        
                                                        </button>
                                                        {/* delete image */}
                                                        <button
                                                            onClick={() => {
                                                                removeImage(result.image);
                                                            } }
                                                            className='hover:underline'
                                                        >
                                                            <div className='flex flex-row items-center gap-2'>
                                                                <span>
                                                                    Delete
                                                                </span>
                                                            </div>
                                                        </button>

                                                    </div>
                                                )}
                                            </>
                                        )}
                                            


                                    </div>
                                </div>

                            ))}

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
                //console.log("settings");
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