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

  const agentContractAddress = params.agent;
  const agentTokenId = params.tokenId;

  console.log("agentContractAddress", agentContractAddress);
  console.log("agentTokenId", agentTokenId);

  //console.log("params", params);

  const searchParams = useSearchParams();
 
  const wallet = searchParams.get('wallet');

  const token = searchParams.get('token');

  //console.log("token", token);

  const tokenImage = "/token-" + "usdt" + "-icon.png";
  
  
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
  useEffect(() => {
      
    if (address && params.chain === "tron") {

      // get tron wallet address
      const getTronWalletAddress = async () => {

        const response = await fetch('/api/tron/getTronWalletAddress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lang: params.lang,
            chain: params.chain,
            walletAddress: address,
          }),
        });

        if (!response) return;

        const data = await response.json();

        setTronWalletAddress(data.result.tronWalletAddress);

      };

      getTronWalletAddress();

    }

  } , [address, params.chain, params.lang]);


  console.log("tronWalletAddress", tronWalletAddress);









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

      console.log("getUsers", data);


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



  const sendUsdt = async () => {
    if (sending) {
      return;
    }

    // check chain
    // if chain is tron, send TRC20 USDT

    if (params.chain === "tron" && !recipient.tronWalletAddress) {
      toast.error('Please enter a valid address');
      return;
    }

    if (params.chain !== "tron" && !recipient.walletAddress) {
      toast.error('Please enter a valid address');
      return;
    }

    if (!amount) {
      toast.error('Please enter a valid amount');
      return;
    }

    //console.log('amount', amount, "balance", balance);

    if (params.chain === "tron" && Number(amount) > usdtBalance) {
      toast.error('Insufficient balance');
      return;
    }

    if (params.chain !== "tron" && Number(amount) > balance) {
      toast.error('Insufficient balance');
      return;
    }

    setSending(true);



    try {


      if (params.chain === "tron") {

        const tronWeb = new TronWeb({
          fullHost: 'https://api.trongrid.io',
          
          headers: {

            //'TRON-PRO-API-KEY': process.env.TRONGRID_API_KEY,

            'TRON-PRO-API-KEY': '429a03b7-ef22-4723-867e-5dcfeef6f787',

          },

          ///privateKey: user.tronWalletPrivateKey,
            
        });

        tronWeb.setPrivateKey(user.tronWalletPrivateKey);


        // send TRC20 USDT
        const contract = await tronWeb.contract().at(contractAddressTron);

        // fee_limit
        // out of energy error occurs when the fee_limit is too low
        // send TRC20 USDT
        // tronWeb.transactionBuilder



        const result = await contract.transfer(
          recipient.tronWalletAddress,
          //amount * 10 ** 6
          TronWeb.toSun(amount)
        ).send();

        /*
        ).send({

          feeLimit: 100000000,
          callValue: 0,
          shouldPollResponse: true,

        });
        */

        ///const result = await contract.transfer(recipient.tronWalletAddress, amount * 10 ** 6).send();




        console.log("result", result);


        if (result) {
          toast.success(USDT_sent_successfully);

          setAmount(0); // reset amount

          // refresh usdt balance

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





        } else {
          toast.error(Failed_to_send_USDT);
        }









      } else {



        // send USDT
        // Call the extension function to prepare the transaction
        const transaction = transfer({
            //contract,

            contract: contract,

            to: recipient.walletAddress,
            amount: amount,
        });
        

        const { transactionHash } = await sendTransaction({
          
          account: activeAccount as any,

          transaction,
        });

        
        if (transactionHash) {


          await fetch('/api/transaction/setTransfer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              lang: params.lang,
              chain: params.chain,
              walletAddress: address,
              amount: amount,
              toWalletAddress: recipient.walletAddress,
            }),
          });



          toast.success(USDT_sent_successfully);

          setAmount(0); // reset amount

          // refresh balance

          // get the balance

          const result = await balanceOf({
            contract,
            address: address || "",
          });

          //console.log(result);

          setBalance( Number(result) / 10 ** 6 );

        } else {

          toast.error(Failed_to_send_USDT);

        }

      }

      


    } catch (error) {
      
      console.error("error", error);

      toast.error(Failed_to_send_USDT);
    }

    setSending(false);
  };



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
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/agent/getApplications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                }),
            });

            if (!response.ok) {
                console.error("Error fetching agents");
                return;
            }

            const data = await response.json();

            const total = data.result.totalCount;

            setApplications(data.result.applications);

        };
        fetchData();
    }, []);





  return (

    <main className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto">

      <div className="py-0 w-full ">

        {/* goto home button using go back icon
        history back
        */}
        <AppBarComponent />


        {/*
        <Header />
        */}

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
        

        {/* history back */}
        <div className='mt-5 flex flex-row items-center gap-2'>
          <button
            onClick={() => router.back()}
            className="text-gray-600 font-semibold underline">
            돌아가기
          </button>
        </div>



        <div className="flex flex-col items-start justify-center space-y-4">


          {/* application list */}
          <div className='w-full flex flex-col gap-5'>

            <div className='flex flex-row items-center gap-2'>
                <span className='text-lg font-semibold text-gray-800'>
                    HTX 신청목록
                </span>
            </div>

            <div className='w-full flex flex-col gap-5'>

                                  {applications.map((application) => (
                                    <div
                                        key={application._id}
                                        className='w-full flex flex-col gap-5
                                        border border-gray-300 p-4 rounded-lg bg-gray-100
                                    '>

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



                                        <div className='w-full flex flex-row items-center justify-between gap-2'>
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


                                        <div className='w-full flex flex-row items-center justify-between gap-2'>
                                            <span className='text-sm text-gray-800'>
                                                상태: 준비중
                                            </span>
                                            <button
                                                className="bg-blue-500 text-white p-2 rounded-lg
                                                    hover:bg-blue-600
                                                "
                                            >
                                                승인하기
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