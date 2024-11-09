// send USDT
'use client';


import React, { use, useEffect, useState } from 'react';

import { toast } from 'react-hot-toast';
import { client } from '../../../../../client';

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
  createWallet,
  inAppWallet,
} from "thirdweb/wallets";

import Image from 'next/image';

import AppBarComponent from "@/components/Appbar/AppBar";
import { getDictionary } from "../../../../../dictionaries";

import { useQRCode } from 'next-qrcode';




const wallets = [
  inAppWallet({
    auth: {
      options: ["phone"],
    },
  }),
];




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

import { Select } from '@mui/material';
import { Sen } from 'next/font/google';
import { Router } from 'next/router';
import path from 'path';

import { TronWeb, utils as TronWebUtils, Trx, TransactionBuilder, Contract, Event, Plugin } from 'tronweb';






export default function AgentPage({ params }: any) {

  const agentContractAddress = params.contract;
  const agentTokenId = params.tokenId;

  console.log("agentContractAddress", agentContractAddress);
  console.log("agentTokenId", agentTokenId);

  //console.log("params", params);

  const searchParams = useSearchParams();
 
 

  console.log("agentContractAddress", agentContractAddress);

  
  const [agent, setAgent] = useState({} as any);

  const [loadingAgent, setLoadingAgent] = useState(false);
  useEffect(() => {
      
      const getAgent = async () => {

        setLoadingAgent(true);
  
        const response = await fetch('/api/agent/getAgentNFTByContractAddressAndTokenId', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            erc721ContractAddress: agentContractAddress,
            tokenId: agentTokenId,
          }),
        });

        if (!response) {
          setLoadingAgent(false);
          return;
        }
  
        const data = await response.json();
  
        setAgent(data.result);

        ////console.log("agent======", data.result);

        setLoadingAgent(false);
  
      };
  
      if (agentContractAddress && agentTokenId) getAgent();
  
  }, [agentContractAddress, agentTokenId]);

   
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



  const { Canvas } = useQRCode();





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



  const [amount, setAmount] = useState(0);




  const [nativeBalance, setNativeBalance] = useState(0);
  const [balance, setBalance] = useState(0);
  useEffect(() => {

    // get the balance
    const getBalance = async () => {

      ///console.log('getBalance address', address);

      
      const result = await balanceOf({
        contract,
        address: address || "",
      });

  
      //console.log(result);

      if (!result) return;
  
      setBalance( Number(result) / 10 ** 6 );


      await fetch('/api/user/getBalanceByWalletAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chain: params.chain,
          walletAddress: address,
        }),
      })

      .then(response => response.json())

      .then(data => {
          setNativeBalance(data.result?.displayValue);
      });



    };

    if (address) getBalance();

    const interval = setInterval(() => {
      if (address) getBalance();
    } , 1000);

    return () => clearInterval(interval);

  } , [address, contract, params.chain]);











  const [user, setUser] = useState(
    {
      _id: '',
      id: 0,
      email: '',
      nickname: '',
      avatar: '',
      mobile: '',
      walletAddress: '',
      createdAt: '',
      settlementAmountOfFee: '',
      tronWalletAddress: '',
      tronWalletPrivateKey: '',
    }
  );

  useEffect(() => {

    if (!address) return;

    const getUser = async () => {

      const response = await fetch('/api/user/getUserByWalletAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
        }),
      });

      if (!response) return;

      const data = await response.json();


      setUser(data.result);

    };

    getUser();

  }, [address]);



  const [tronWalletAddress, setTronWalletAddress] = useState('');



  // get list of user wallets from api
  const [users, setUsers] = useState([
    {
      _id: '',
      id: 0,
      email: '',
      avatar: '',
      nickname: '',
      mobile: '',
      walletAddress: '',
      createdAt: '',
      settlementAmountOfFee: '',
    }
  ]);

  const [totalCountOfUsers, setTotalCountOfUsers] = useState(0);

  useEffect(() => {

    if (!address) return;

    const getUsers = async () => {

      const response = await fetch('/api/user/getAllUsers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({

        }),
      });

      const data = await response.json();

      ///setUsers(data.result.users);
      // set users except the current user

      setUsers(data.result.users.filter((user: any) => user.walletAddress !== address));



      setTotalCountOfUsers(data.result.totalCount);

    };

    getUsers();


  }, [address]);






  const [recipient, setRecipient] = useState({
    _id: '',
    id: 0,
    email: '',
    nickname: '',
    avatar: '',
    mobile: '',
    walletAddress: '',
    tronWalletAddress: '',
    createdAt: '',
    settlementAmountOfFee: '',
  });



  ///console.log("recipient", recipient);

  //console.log("recipient.walletAddress", recipient.walletAddress);
  //console.log("amount", amount);



  const [otp, setOtp] = useState('');

  
  
  /////const [verifiedOtp, setVerifiedOtp] = useState(false);
  const [verifiedOtp, setVerifiedOtp] = useState(true); // for testing


  const [isSendedOtp, setIsSendedOtp] = useState(false);



  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const [isVerifingOtp, setIsVerifingOtp] = useState(false);

  

  const sendOtp = async () => {

    setIsSendingOtp(true);
      
    const response = await fetch('/api/transaction/setOtp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lang: params.lang,
        chain: params.chain,
        walletAddress: address,
        mobile: user.mobile,
      }),
    });

    const data = await response.json();

    //console.log("data", data);

    if (data.result) {
      setIsSendedOtp(true);
      toast.success('OTP sent successfully');
    } else {
      toast.error('Failed to send OTP');
    }

    setIsSendingOtp(false);

  };

  const verifyOtp = async () => {

    setIsVerifingOtp(true);
      
    const response = await fetch('/api/transaction/verifyOtp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lang: params.lang,
        chain: params.chain,
        walletAddress: address,
        otp: otp,
      }),
    });

    const data = await response.json();

    //console.log("data", data);

    if (data.status === 'success') {
      setVerifiedOtp(true);
      toast.success('OTP verified successfully');
    } else {
      toast.error('Failed to verify OTP');
    }

    setIsVerifingOtp(false);
  
  }




  const [sending, setSending] = useState(false);




  // get user by wallet address
  const getUserByWalletAddress = async (walletAddress: string) => {

    const response = await fetch('/api/user/getUserByWalletAddress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress: walletAddress,
      }),
    });

    const data = await response.json();

    //console.log("getUserByWalletAddress", data);

    return data.result;

  };


  // get user by wallet address
  const getUserByTronWalletAddress = async (tronWalletAddress: string) => {

    const response = await fetch('/api/user/getUserByTronWalletAddress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tronWalletAddress: tronWalletAddress,
      }),
    });

    const data = await response.json();

    //console.log("getUserByWalletAddress", data);

    return data.result;

  };





  
  const [wantToReceiveWalletAddress, setWantToReceiveWalletAddress] = useState(false);


  const [isWhateListedUser, setIsWhateListedUser] = useState(false);

  
  useEffect(() => {

    if (!recipient?.walletAddress) {
      return;
    }

    // check recipient.walletAddress is in the user list
    getUserByWalletAddress(recipient?.walletAddress)
    .then((data) => {
        
        //console.log("data============", data);
  
        const checkUser = data

        if (checkUser) {
          setIsWhateListedUser(true);

          setRecipient(checkUser as any);

        } else {
          setIsWhateListedUser(false);

          setRecipient({


            _id: '',
            id: 0,
            email: '',
            nickname: '',
            avatar: '',
            mobile: '',
            walletAddress: recipient?.walletAddress,
            tronWalletAddress: tronWalletAddress,
            createdAt: '',
            settlementAmountOfFee: '',

          });


        }

    });

  } , [recipient?.walletAddress, tronWalletAddress]);



  useEffect(() => {

    if (!recipient?.tronWalletAddress) {
      return;
    }

    // check recipient.walletAddress is in the user list
    getUserByTronWalletAddress(recipient?.tronWalletAddress)

    .then((data) => {
        
        //console.log("data============", data);
  
        const checkUser = data

        if (checkUser) {
          setIsWhateListedUser(true);

          setRecipient(checkUser as any);

        } else {
          setIsWhateListedUser(false);

          setRecipient({


            _id: '',
            id: 0,
            email: '',
            nickname: '',
            avatar: '',
            mobile: '',
            walletAddress: '',
            tronWalletAddress: recipient?.tronWalletAddress,
            createdAt: '',
            settlementAmountOfFee: '',

          });


        }

    });

  } , [recipient?.tronWalletAddress]);
  


  




  // getTronBalance
  /*
  const [tronBalance, setTronBalance] = useState(0);
  useEffect(() => {
    if (tronWalletAddress && params.chain === "tron") {
      const getTronBalance = async () => {
        const response = await fetch('/api/tron/getTronBalance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lang: params.lang,
            chain: params.chain,
            tronWalletAddress: tronWalletAddress,
          }),
        });

        if (!response) return;

        const data = await response.json();

        setTronBalance(data.result.tronBalance);

      };

      getTronBalance();

    }

  } , [tronWalletAddress, params.chain, params.lang]);
  */


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

        console.log("data", data);

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

    fetchData();
}, [address]);



  // usdt balance
  const [usdtBalance, setUsdtBalance] = useState(0);
  useEffect(() => {
    if (tronWalletAddress && params.chain === "tron") {
      const getUsdtBalance = async () => {
        const response = await fetch('/api/tron/getUsdtBalance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lang: params.lang,
            chain: params.chain,
            tronWalletAddress: tronWalletAddress,
          }),
        });

        if (!response) return;

        const data = await response.json();

        setUsdtBalance(data.result?.usdtBalance);

      };

      getUsdtBalance();

    }

  } , [tronWalletAddress, params.chain, params.lang]);



  console.log("recipient", recipient);
  console.log("address", address);
  console.log("amount", amount);
  console.log("verifiedOtp", verifiedOtp);
  console.log("sending", sending);







    // get all applications
    const [applications, setApplications] = useState([] as any[]);
    const [loadingApplications, setLoadingApplications] = useState(false);
    useEffect(() => {
        const fetchData = async () => {

            setLoadingApplications(true);
            const response = await fetch("/api/agent/getReferApplications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    page: 1,
                    limit: 10,
                    agentBot: agentContractAddress,
                    agentBotNumber: agentTokenId,
                }),
            });

            if (!response.ok) {
                console.error("Error fetching agents");
                setLoadingApplications(false);
                return;
            }

            const data = await response.json();

            console.log("getReferApplications data", data);



            const total = data.result.totalCount;

            setApplications(data.result.applications);

            setLoadingApplications(false);

        };

        if (agentContractAddress && agentTokenId) fetchData();

    }, [agentContractAddress, agentTokenId]);





  return (

    <main className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto">

      <div className="py-0 w-full ">

        {/* goto home button using go back icon
        history back
        */}
        <AppBarComponent />



        {/*
        <div className="mt-4 flex justify-start space-x-4 mb-10">
            <button
              
              onClick={() => router.push(
                
                //'/' + params.lang + '/' + params.chain

                wallet === "smart" ?
                '/' + params.lang + '/' + params.chain + '/?wallet=smart'
                :
                '/' + params.lang + '/' + params.chain

              )}

              className="text-gray-600 font-semibold underline">
              {Go_Home}
            </button>
        </div>
        */}
        

        {/* header */}
        <div className="w-full flex flex-col items-start justify-center space-y-4">
          <div className="flex flex-row items-center gap-2">
            <Image
              src={avatar}
              width={50}
              height={50}
              alt="Agent"
              className="rounded-lg
                object-cover
              "
            />
            <span className="text-lg font-semibold text-gray-800">
              에이전트 NFT 상세정보
            </span>

            {!address && (
              <ConnectButton
                client={client}

                //wallets={wallets}

                wallets={[
                    inAppWallet({
                      auth: {
                        options: ["phone"],
                      },
                    }),
                ]}

                
                accountAbstraction={{   
                    chain: polygon,
                    factoryAddress: "0x9Bb60d360932171292Ad2b80839080fb6F5aBD97", // polygon, arbitrum
                    gasless: true,
                }}
                
                
                theme={"light"}

                

                connectButton={{
                    label: "Sign in with OWIN Magic Wallet",
                }}

                connectModal={{
                size: "wide",                            
                showThirdwebBranding: false,

                }}

                appMetadata={
                {
                    logoUrl: "https://gold.goodtether.com/logo.png",
                    name: "Next App",
                    url: "https://gold.goodtether.com",
                    description: "This is a Next App.",

                }
                }

                //locale={"ko_KR"}
                locale={"en_US"}
              />
            )}

           {address && userCode && (

                  <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                      {nickname}
                  </div>

            )}


          </div>
        </div>






        {/* history back */}
        <div className='mt-5 flex flex-row items-center gap-2'>
          <button
            onClick={() => router.push(
              '/' + params.lang + '/' + params.chain + '/profile-settings'
            )}
            className="flex flex-row items-center gap-2 bg-gray-500 text-white p-2 rounded-lg
              hover:bg-gray-600
            "
          >
            <Image
              src="/icon-back.png"
              width={24}
              height={24}
              alt="Back"
            />
            <span className='text-sm text-white'>
              Agent Home
            </span>
          </button>
        </div>



        <div className="mt-10 flex flex-col items-start justify-center space-y-4">


          <div className='flex flex-row items-center gap-2'>
              <Image
                src='/icon-nft.png'
                width={30}
                height={30}
                alt='Agent'
                className='rounded-lg'
              />
              <span className='text-lg font-semibold text-gray-800'>
                  에이전트 NFT 정보
              </span>
          </div>

          {/* agent nft info */}
          <div className='w-full flex flex-col gap-5
            border border-gray-300 p-4 rounded-lg bg-gray-100
          '>






            {agent && (

              <div className='w-full flex flex-col gap-5'>


                <div className='w-full flex flex-row gap-2 items-center justify-between'>
                    
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(
                                'https://owinwallet.com/kr/polygon/tbot/?agent=' +
                                agentContractAddress + '&tokenId=' + agentTokenId
                            );
                            toast.success('레퍼럴 URL 복사 완료');
                        }}
                        className="w-full p-2 bg-blue-500 text-zinc-100 rounded hover:bg-blue-600"
                    >
                        레퍼럴 URL 복사
                    </button>

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
                            width={30}
                            height={30}
                            className="rounded-lg"
                        />
                    </button>

                </div>


                <div className='w-full flex flex-row items-center justify-between gap-2'>
                    <span className='text-lg font-semibold text-gray-800'>
                        에이전트 NFT ID: #{agentTokenId}
                    </span>
                </div>

                <div className='w-full flex flex-row items-center justify-between gap-2'>
                    <span className='text-xs text-gray-800'>
                        에이전트 NFT 계약주소: {agentContractAddress}
                    </span>
                </div>

                <div className='w-full flex flex-row items-center justify-between gap-2'>
                    <span className='text-sm text-gray-800'>
                        에이전트 NFT 이름: {agent.name}
                    </span>
                </div>

                <div className='w-full flex flex-row items-center justify-between gap-2'>
                    <span className='text-sm text-gray-800'>
                        에이전트 NFT 설명: {agent.description}
                    </span>
                </div>

                <div className='w-full flex flex-col items-start justify-between gap-2'>

                    <span className='text-sm text-gray-800'>
                        에이전트 NFT 이미지:
                    </span>
                    {agent.image && (
                      <Image
                        src={agent.image?.pngUrl}
                        width={100}
                        height={100}
                        alt={agent.name}
                        className='rounded-lg object-cover'
                      />
                    )}

                </div>

              </div>

            )}

          </div>





          {/* application list */}
          <div className='mt-10 w-full flex flex-col gap-5'>

            <div className='flex flex-row items-center gap-2'>
                <Image
                    src='/icon-application.png'
                    width={30}
                    height={30}
                    alt='Application'
                    className='rounded-lg'
                />
                <span className='text-lg font-semibold text-gray-800'>
                    HTX 신청목록
                </span>
            </div>

            {loadingApplications && (
              <div className='w-full flex flex-col gap-5
                border border-gray-300 p-4 rounded-lg bg-gray-100
              '>
                <div className='w-full flex flex-row items-center justify-between gap-2'>
                  <span className='text-xl font-semibold text-gray-800'>
                    Loading...
                  </span>
                </div>
              </div>
            )}

              <div className='w-full flex flex-col gap-5'>
                  {/* total count */}
                  <span className='text-lg text-gray-800'>
                      총 {applications.length}개의 신청이 있습니다.
                  </span>
              </div>

              <div className='w-full grid grid-cols-1 xl:grid-cols-2 gap-5'>

                {applications.map((application) => (
                    <div
                        key={application._id}
                        className='w-full flex flex-col gap-5
                        border border-gray-300 p-4 rounded-lg bg-gray-100
                    '>
                        {/* 신청일 */}
                        <div className='w-full flex flex-row items-center justify-between gap-2'>
                            <span className='text-sm text-gray-800'>
                                신청일: {
                                application.createdAt
                                ? new Date(application.createdAt).toLocaleString()
                                : ''}
                            </span>
                        </div>

                        <div className='w-full flex flex-row items-center justify-between gap-2'>
                            <span className='text-xl font-semibold text-gray-800'>
                                HTX UID: {application.htxUid}
                            </span>
                            {/* copy button */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(application.htxUid);
                                    toast.success("Copied to clipboard");
                                }}
                                className="bg-gray-500 text-white p-2 rounded-lg
                                    hover:bg-gray-600
                                "
                            >
                                Copy
                            </button>
                        </div>

                        <div className='w-full flex flex-row items-center justify-between gap-2'>
                            <span className='text-sm text-gray-800'>
                                이름: {application.userName}
                            </span>
                            {/* copy button */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(application.userPhoneNumber);
                                    toast.success("Copied to clipboard");
                                }}
                                className="bg-gray-500 text-white p-2 rounded-lg
                                    hover:bg-gray-600
                                "
                            >  
                                Copy
                            </button>
                        </div>
                        <div className='w-full flex flex-row items-center justify-between gap-2'>
                            <span className='text-sm text-gray-800'>
                                핸드폰번호: {application.userPhoneNumber}
                            </span>
                            {/* copy button */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(application.userPhoneNumber);
                                    toast.success("Copied to clipboard");
                                }}
                                className="bg-gray-500 text-white p-2 rounded-lg
                                    hover:bg-gray-600
                                "
                            >
                                Copy
                            </button>
                        </div>

                        <div className='w-full flex flex-row items-center justify-between gap-2'>
                            <span className='text-sm text-gray-800'>
                                이메일주소: {application.userEmail}
                            </span>
                            {/* copy button */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(application.userEmail);
                                    toast.success("Copied to clipboard");
                                }}
                                className="bg-gray-500 text-white p-2 rounded-lg
                                    hover:bg-gray-600
                                "
                            >
                                Copy
                            </button>
                        </div>



                        <div className='w-full hidden flex-row items-center justify-between gap-2'>
                            <span className='text-xs text-gray-800'>
                                HTX USDT(TRON) 지갑주소: {application.htxUsdtWalletAddress}
                            </span>
                            {/* copy button */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(application.htxUsdtWalletAddress);
                                    toast.success("Copied to clipboard");
                                }}
                                className="bg-gray-500 text-white p-2 rounded-lg
                                    hover:bg-gray-600
                                "
                            >
                                Copy
                            </button>
                        </div>

                        <div className='w-full flex flex-row items-center justify-between gap-2'>
                            <span className='text-sm text-gray-800'>
                                API Access Key: {application.apiAccessKey}
                            </span>
                            {/* copy button */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(application.apiAccessKey);
                                    toast.success("Copied to clipboard");
                                }}
                                className="bg-gray-500 text-white p-2 rounded-lg
                                    hover:bg-gray-600
                                "
                            >
                                Copy
                            </button>
                        </div>

                        <div className='w-full flex flex-row items-center justify-between gap-2'>
                            <span className='text-sm text-gray-800'>
                                API Secret Key: {application.apiSecretKey}
                            </span>
                            {/* copy button */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(application.apiSecretKey);
                                    toast.success("Copied to clipboard");
                                }}
                                className="bg-gray-500 text-white p-2 rounded-lg
                                    hover:bg-gray-600
                                "
                            >
                                Copy
                            </button>
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
