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




import {
    useRouter,
    useSearchParams
  }from "next//navigation";

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

    getNFT,
  
} from "thirdweb/extensions/erc1155";



import {
    getNFT as getNFT721,
} from "thirdweb/extensions/erc721";


import { getContractMetadata } from "thirdweb/extensions/common";


import { Alert, useForkRef } from '@mui/material';


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



const erc1155ContractAddress = "0xd782447a0762966714a150dBC0E5a16fE488d566"; // Polygon

/*
const contractErc1155 = getContract({
    client,
    chain: polygon,
    address: erc1155ContractAddress,
});


const nftInfoTbot100 = await getNFT({
    contract: contractErc1155,
    tokenId: 0n,
});

console.log("nftInfoTbot100", nftInfoTbot100);

const nftInfoTbot1000 = await getNFT({
    contract: erc1155ContractAddress,
    tokenId: 1n,
});

const nftInfoTbot10000 = await getNFT({
    contract: erc1155ContractAddress,
    tokenId: 2n,
});
*/


const contractErc1155 = getContract({
    client,
    chain: polygon,
    address: erc1155ContractAddress,
});


export default function AIPage({ params }: any) {


    console.log("SettingsPage params", params);
    
    
    // get params from the URL

    const searchParams = useSearchParams();

    const wallet = searchParams.get('wallet');

    const agent = searchParams.get('agent');
    
    
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
      /*
      const interval = setInterval(() => {
        getBalance();
      }, 1000);
  
  
      return () => clearInterval(interval);
        */
  
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
    , [ address ]);
    


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
                    contract: contractErc1155,
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
    console.log("agent", agent);
    



    // get all agents
    const [agents, setAgents] = useState([] as any[]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/user/getAllAgents", {
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


            setAgents(data.result.users);
        };
        fetchData();
    }, []);


    console.log("agents", agents);


    useEffect(() => {

        if (agents.length > 0) {
            
        }

    } , [agents]);



    // agentBot
    const [agentBot, setAgentBot] = useState(agent || "");



    // getNFt721 for agentBot (ERC721 contract address)
    /*
    const [agentBotErc721, setAgentBotErc721] = useState({} as any);


    const [agentBotImage, setAgentBotImage] = useState("/logo-masterbot100.png");

 
    useEffect(() => {

        const fetchData = async () => {

            if (agentBot === "") {
                return;
            }


            const contract = getContract({
                client,
                chain: polygon,
                address: agentBot,
            });

            const nft721 = await getNFT721({
                contract: contract,
                tokenId: 0n,
            });

            /////console.log("nft721======", nft721);


            const metadata = await getContractMetadata({ contract });

            console.log("metadata======", metadata);
                

            //setAgentBotErc721(nft721);
            
            if (agentBot === "0x54DE6C9a312EB4e2240036f503e92b7Bab27B068") {
                setAgentBotImage("/logo-masterbot100.png");
            } else {
                setAgentBotImage("/logo-masterbot100.png");
            }

        };

        fetchData();

    } , [agentBot]);


    console.log("agentBotErc721", agentBotErc721);
    */


    // selectedBotNumber
    const [selectedBotNumber, setSelectedBotNumber] = useState(0);

    const [myAgent, setMyAgent] = useState({} as any);
    const [myAgentNFT, setMyAgentNFT] = useState({} as any);

    // apply to mint NFT
    // 이름, 핸드폰번호, 이메일주소, HTX UID, HTX USDT(TRON) 지갑주소, API Access Key, API Secret Key

    const [userName, setUserName] = useState("");
    useEffect(() => {
        nickname && setUserName(nickname);
    } , [nickname]);

    const [userPhoneNumber, setUserPhoneNumber] = useState("");
    useEffect(() => {
        phoneNumber && setUserPhoneNumber(phoneNumber);
    } , [phoneNumber]);

    const [userEmail, setUserEmail] = useState("");
    const [htxUid, setHtxUid] = useState("");
    const [htxUsdtWalletAddress, setHtxUsdtWalletAddress] = useState("");
    const [apiAccessKey, setApiAccessKey] = useState("");
    const [apiSecretKey, setApiSecretKey] = useState("");



    //const [accountBalance, setAccountBalance] = useState(0);
    const [accountBalanceList, setAccountBalanceList] = useState([] as any[]);

    
    const [applyingMintNFT, setApplyingMintNFT] = useState(false);

    const applyMintAgentBot = async () => {

        if (address === "") {
            toast.error("먼저 지갑을 연결해 주세요.");
            return;
        }

        if (agentBot === "") {
            toast.error("Agent Bot을 선택해 주세요.");
            return;
        }

        if (userName === "") {
            toast.error("이름을 입력해 주세요.");
            return;
        }

        if (userPhoneNumber === "") {
            toast.error("핸드폰번호를 입력해 주세요.");
            return;
        }

        if (userEmail === "") {
            toast.error("이메일주소를 입력해 주세요.");
            return;
        }

        if (htxUid === "") {
            toast.error("HTX UID를 입력해 주세요.");
            return;
        }

        if (htxUsdtWalletAddress === "") {
            toast.error("HTX USDT(TRON) 지갑주소를 입력해 주세요.");
            return;
        }

        if (apiAccessKey === "") {
            toast.error("API Access Key를 입력해 주세요.");
            return;
        }

        if (apiSecretKey === "") {
            toast.error("API Secret Key를 입력해 주세요.");
            return;
        }

        setApplyingMintNFT(true);

        // api call

        const response = await fetch("/api/agent/applyMintNFT", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                walletAddress: address,
                agentBot: agentBot,
                agentBotNumber: selectedBotNumber,
                userName: userName,
                userPhoneNumber: userPhoneNumber,
                userEmail: userEmail,
                htxUid: htxUid,
                htxUsdtWalletAddress: htxUsdtWalletAddress,
                apiAccessKey: apiAccessKey,
                apiSecretKey: apiSecretKey,
            }),
        });

        if (!response.ok) {
            setApplyingMintNFT(false);
            toast.error("NFT Mint 신청에 실패했습니다.");
            return;
        }

        const data = await response.json();

        //console.log("data", data);

        if (data.result) {
            setApplyingMintNFT(false);
            toast.success("NFT Mint 신청이 완료되었습니다.");


            setMyAgent(data.result);

            const erc721ContractAddress = data.result.agentBot;
            const tokenId = data.result.agentBotNumber;

            const fetchedNFT = await fetch("/api/agent/getAgentNFTByContractAddressAndTokenId", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    erc721ContractAddress: erc721ContractAddress,
                    tokenId: tokenId,
                }),
            });

            if (!fetchedNFT.ok) {
                console.error("Error fetching NFT");
                return;
            }

            const nftData = await fetchedNFT.json();
            setMyAgentNFT(nftData.result);


        } else {
            setApplyingMintNFT(false);
            toast.error("NFT Mint 신청에 실패했습니다.");
        }

    }


    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/agent/getMyAgent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                }),
            });

            if (!response.ok) {
                console.error("Error fetching my agent");
                return;
            }

            const data = await response.json();

            if (data.result) {

                setMyAgent(data.result);


                const erc721ContractAddress = data.result.agentBot;
                const tokenId = data.result.agentBotNumber;

                const fetchedNFT = await fetch("/api/agent/getAgentNFTByContractAddressAndTokenId", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        erc721ContractAddress: erc721ContractAddress,
                        tokenId: tokenId,
                    }),
                });


                const nftData = await fetchedNFT.json();
                setMyAgentNFT(nftData.result);

            }


        };
        fetchData();
    } , [address]);


    console.log("myAgentNFT", myAgentNFT);

  
   const [agentBotList, setAgentBotList] = useState([] as any[]);
   const [loadingAgentBotList, setLoadingAgentBotList] = useState(false);

   const changeAgentBot = async (agentBot: string) => {

        if (agentBot === "") {
            return;
        }

        setAgentBot(agentBot);

        setSelectedBotNumber(0);

        try {


            setLoadingAgentBotList(true);

            // api /api/agent/getAgentNFTByWalletAddress

            const response = await fetch("/api/agent/getAgentNFTByContractAddress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    erc721ContractAddress: agentBot,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get NFTs');
            }

            const data = await response.json();


            if (data.result) {
                setAgentBotList(data.result.nfts);
            } else {
                setAgentBotList([]);
            }
            

        } catch (error) {
            console.error("Error getting NFTs", error);
        }
           
        setLoadingAgentBotList(false);

    };


    const [isValidAPIKey, setIsValidAPIKey] = useState(false);

    // check htx api key
    const [checkingHtxApiKey, setCheckingHtxApiKey] = useState(false);
    const checkHtxApiKey = async (
        htxAccessKey: string,
        htxSecretKey: string,
    ) => {

       
        if (htxAccessKey === "") {
            toast.error("HTX Access Key를 입력해 주세요.");
            return;
        }

        if (htxSecretKey === "") {
            toast.error("HTX Secret Key를 입력해 주세요.");
            return;
        }

        setCheckingHtxApiKey(true);

        const response = await fetch("/api/agent/getAccount", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                htxAccessKey: htxAccessKey,
                htxSecretKey: htxSecretKey,
            }),
        });
        /*
        {
            status: 'ok',
            data: [ { id: 63912897, type: 'spot', subtype: '', state: 'working' } ]
        }
        */

        const data = await response.json();

        console.log("data.result", data.result);

        if (data.result?.status === "ok") {

            setIsValidAPIKey(true);

            setHtxUid(data.result?.data[0]?.id);

            toast.success("HTX API Key가 확인되었습니다.");
        } else {
            toast.error("HTX API Key를 확인할 수 없습니다.");
        }

        setCheckingHtxApiKey(false);

    };



    const [isValidBalance, setIsValidBalance] = useState(false);

    // check account balance
    const [checkingAccountBalance, setCheckingAccountBalance] = useState(false);
    const checkAccountBalance = async (
        htxAccessKey: string,
        htxSecretKey: string,
        accountId: string,
    ) => {

        if (htxAccessKey === "") {
            toast.error("HTX Access Key를 입력해 주세요.");
            return;
        }

        if (htxSecretKey === "") {
            toast.error("HTX Secret Key를 입력해 주세요.");
            return;
        }

        setCheckingAccountBalance(true);

        const response = await fetch("/api/agent/getBalance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                htxAccessKey: htxAccessKey,
                htxSecretKey: htxSecretKey,
                accountId: accountId,
                currency: "usdt",
            }),
        });

        const data = await response.json();

        ///console.log("data.result", data.result);

        if (data.result?.status === "ok") {
            
            ///{ currency: 'usdt', balance: '0.00117522' }, { currency: 'htx', balance: '0.00000000' }

            setAccountBalanceList(data.result?.data);


            setIsValidBalance(true);


            toast.success("HTX 계정 잔고가 확인되었습니다.");
        } else {
            toast.error("HTX 계정 잔고를 확인할 수 없습니다.");
        }

        setCheckingAccountBalance(false);

    };


    // check htx asset valuation
    const [checkingHtxAssetValuation, setCheckingHtxAssetValuation] = useState(false);
    const [htxAssetValuation, setHtxAssetValuation] = useState(0);
    const checkHtxAssetValuation = async (
        htxAccessKey: string,
        htxSecretKey: string,
    ) => {

        if (htxAccessKey === "") {
            toast.error("HTX Access Key를 입력해 주세요.");
            return;
        }

        if (htxSecretKey === "") {
            toast.error("HTX Secret Key를 입력해 주세요.");
            return;
        }

        setCheckingHtxAssetValuation(true);

        const response = await fetch("/api/agent/getAssetValuation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                htxAccessKey: htxAccessKey,
                htxSecretKey: htxSecretKey,
            }),
        });

        const data = await response.json();

        console.log("data.result", data.result);

        if (data.result?.status === "ok") {

            setHtxAssetValuation(Number(data.result?.balance));

            toast.success("HTX 자산 가치가 확인되었습니다.");
        } else {
            toast.error("HTX 자산 가치를 확인할 수 없습니다.");
        }

        setCheckingHtxAssetValuation(false);

    };


    // search match results
    const [searchResults, setSearchResults] = useState([] as any[]);
    const [searchingMatchResults, setSearchingMatchResults] = useState(false);
    const searchMatchResults = async (
        htxAccessKey: string,
        htxSecretKey: string,
    ) => {

        if (htxAccessKey === "") {
            toast.error("HTX Access Key를 입력해 주세요.");
            return;
        }

        if (htxSecretKey === "") {
            toast.error("HTX Secret Key를 입력해 주세요.");
            return;
        }

        setSearchingMatchResults(true);

        const response = await fetch("/api/agent/searchMatchResults", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                htxAccessKey: htxAccessKey,
                htxSecretKey: htxSecretKey,
            }),
        });

        const data = await response.json();

        ///console.log("data.result====", data.result);

        if (data.result?.status === "ok") {

            setSearchResults(data.result?.data);

            toast.success("HTX 매치 결과가 확인되었습니다.");
        } else {
            toast.error("HTX 매치 결과를 확인할 수 없습니다.");
        }

        setSearchingMatchResults(false);

    };

        
 


    return (

        <main className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto">

            <div className="py-0 w-full">
        

                <AppBarComponent />

                <Header
                    agent={agent || ""}
                />
                


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

                                    
                                    accountAbstraction={{   
                                    chain: params.chain === "arbitrum" ? arbitrum : polygon,
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

                    {/* TBOT 구매 */}
                    <div className='mt-10 flex flex-row items-center gap-2'>
                        {/* dot */}
                        <div className='w-4 h-4 bg-blue-500 rounded-full'></div>
                        <span className='text-xl font-semibold text-zinc-800'>
                            TBOT 구매
                        </span>
                    </div>

                    <div className='mt-5 w-full flex flex-col gap-10 '> 

                        <div className='flex flex-col xl:flex-row gap-5 items-center xl:items-start justify-between border
                         border-yellow-500 p-4 rounded-lg
                        '>
                            
                            <div className='flex flex-row items-center gap-2'>
                                {/* dot */}
                                <div className='w-4 h-4 bg-red-500 rounded-full'></div>
                                <span className='text-2xl font-semibold text-blue-500'>
                                    100 TBOT
                                </span>
                            </div>



                            <div className='flex flex-col items-center justify-center gap-5'>


                                <div className='w-full flex flex-col items-center gap-5
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
                                            src="/logo-tbot-100.png"
                                            alt="TBOT"
                                            width={200}
                                            height={200}
                                        />
                                    </div>
                                    {/* button for buy */}
                                    {/* 121 USDT BUY */}
                                    <button
                                        className={`${!address || amountNft100 > 0 || claimingNFT ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-zinc-100'} p-2 rounded text-lg font-semibold`}
                                        disabled={
                                            !address
                                            || amountNft100 > 0
                                            || claimingNFT
                                        }
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
                                            TBOT NFT 구매중...
                                        </span>
                                    )}

                                    {/* myNfts */}
                                    {address && amountNft100 > 0 && (
                                        <div className='flex flex-row items-center gap-2'>
                                            <span className='text-5xl font-semibold
                                                text-blue-500
                                            '>
                                                1
                                            </span>
                                            <span className='text-lg font-semibold'>
                                                TBOT
                                            </span>
                                        </div>
                                    )}


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

                                {address && myAgent?.id && (
                                    <div className='w-full flex flex-col gap-2
                                        items-center justify-center
                                        border border-gray-300 p-4 rounded-lg
                                    '>
                                        <div className='flex flex-row items-center gap-2'>
                                            <Image
                                                src="/loading.png"
                                                alt="loading"
                                                width={30}
                                                height={30}
                                                className='animate-spin'
                                            />
                                            <span className='text-lg font-semibold text-blue-500'>
                                                AI 에이전트 트레이딩 준비중...
                                            </span>
                                        </div>

                                        <div className='flex flex-col gap-2
                                            border border-yellow-500 p-4 rounded-lg
                                            bg-yellow-100
                                        '>

                                            <div className='flex flex-col xl:flex-row gap-2'>
                                                
                                                <div className='flex flex-col gap-2'>
                                                    <div className='flex flex-row items-center gap-2'>
                                                        {/* dot */}
                                                        <div className='w-4 h-4 bg-blue-500 rounded-full'></div>
                                                        <span className='text-lg font-semibold'>
                                                            Agent Code
                                                        </span>
                                                    </div>
                                                    <span className='text-2xl font-semibold text-gray-500'>
                                                        {myAgent?.agentBot.substring(0, 15) + "..."}
                                                    </span>
                                                </div>
                                                
                                                <div className='flex flex-col gap-2'>
                                                    <div className='flex flex-row items-center gap-2'>
                                                        {/* dot */}
                                                        <div className='w-4 h-4 bg-blue-500 rounded-full'></div>
                                                        <span className='text-lg font-semibold'>
                                                            Agent Number
                                                        </span>
                                                    </div>
                                                    <span className='text-2xl font-semibold text-gray-500'>
                                                        #{myAgent?.agentBotNumber}
                                                    </span>
                                                </div>
                                            </div>

                                            {myAgentNFT && myAgentNFT.image ? (
                                                <div className='flex flex-col gap-2'>
                                                    {/* masterbot image */}
                                                    <Image
                                                        src={myAgentNFT?.image?.pngUrl || "/logo-masterbot100.png"}
                                                        alt="masterbot"
                                                        width={400}
                                                        height={400}
                                                        className='animate-pulse'
                                                    />
                                                    <span className='text-2xl font-semibold text-blue-500'>
                                                        {myAgentNFT?.name}
                                                    </span>
                                                    <span className='text-lg font-semibold text-yellow-500'>
                                                        {myAgentNFT?.description}
                                                    </span>

                                                    {/* running 2 hours */}
                                                    {/* runngin 2 days */}
                                                    <span className='text-sm font-semibold text-gray-500'>
                                                        Running{' '}{(new Date().getTime() - new Date(myAgentNFT.mint.timestamp).getTime()) / 1000 / 60 / 60 / 24 > 1
                                                                    ? `${Math.floor((new Date().getTime() - new Date(myAgentNFT.mint.timestamp).getTime()) / 1000 / 60 / 60 / 24)} days`
                                                                    : `${Math.floor((new Date().getTime() - new Date(myAgentNFT.mint.timestamp).getTime()) / 1000 / 60 / 60)} hours`
                                                                }
                                                    </span>
                                                    {/* accounts */}
                                                    <span className='text-sm font-semibold text-gray-500'>
                                                        Accounts: 23
                                                    </span>

                                                    {/* goto opensea */}
                                                    <button
                                                        className='bg-gray-300 text-gray-500 p-2 rounded text-lg font-semibold
                                                            flex flex-row items-center gap-2
                                                            hover:bg-blue-500 hover:text-zinc-100 hover:shadow-lg
                                                        '
                                                        onClick={() => {
                                                            window.open('https://opensea.io/assets/matic/' + myAgentNFT?.contract.address + '/' + myAgentNFT?.tokenId, "_blank");
                                                        }}
                                                    >
                                                        <Image
                                                            src="/logo-opensea.png"
                                                            alt="opensea"
                                                            width={20}
                                                            height={20}
                                                        />
                                                        <span>
                                                            View on OpenSea
                                                        </span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className='flex flex-col gap-2'>
                                                    <span className='text-lg font-semibold text-blue-500'>
                                                        AI 에이전트 NFT 로딩중...
                                                    </span>
                                                </div>
                                            )}
                                        </div>


                                        <div className='w-full flex flex-col gap-2
                                            border border-gray-300 p-4 rounded-lg
                                        '>

                                            <span className='text-lg font-semibold text-blue-500'>
                                                AI 에이전트 등록 정보
                                            </span>
                                            {/* goto htx */}
                                            <button
                                                className='bg-gray-300 text-gray-500 p-2 rounded text-lg font-semibold
                                                    flex flex-row items-center gap-2
                                                    hover:bg-blue-500 hover:text-zinc-100 hover:shadow-lg
                                                '
                                                onClick={() => {
                                                    window.open('https://www.htx.com.pk/login', "_blank");
                                                }}
                                            >
                                                <div className='flex flex-row items-center gap-2'>
                                                    <Image
                                                        src="/logo-exchange-htx.png"
                                                        alt="HTX"
                                                        width={20}
                                                        height={20}
                                                    />
                                                    <span>
                                                        HTX 로그인
                                                    </span>
                                                </div>
                                            </button>
                                            <div className='flex flex-col gap-2'>
                                                <div className='flex flex-row items-center justify-between gap-2'>
                                                    <span className='text-sm font-semibold text-gray-500'>
                                                        HTX UID: {myAgent.htxUid}
                                                    </span>
                                                    {/* verified */}
                                                    <Image
                                                        src="/verified.png"
                                                        alt="verified"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </div>
                                                <div className='flex flex-row items-center justify-between gap-2'>
                                                    <span className='text-sm font-semibold text-gray-500'>
                                                        API Access Key: {myAgent.apiAccessKey.substring(0, 10) + "..."}
                                                    </span>
                                                    <Image
                                                        src="/verified.png"
                                                        alt="verified"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </div>
                                                <div className='flex flex-row items-center justify-between gap-2'>
                                                    <span className='text-sm font-semibold text-gray-500'>
                                                        API Secret Key: {myAgent.apiSecretKey.substring(0, 10) + "..."}
                                                    </span>
                                                    <Image
                                                        src="/verified.png"
                                                        alt="verified"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </div>

                                                <div className='flex flex-row items-center justify-between gap-2'>
                                                    <span className='text-sm font-semibold text-gray-500'>
                                                        HTX USDT(TRON) 지갑주소: {myAgent.htxUsdtWalletAddress.substring(0, 10) + "..."}
                                                    </span>
                                                    <Image
                                                        src="/verified.png"
                                                        alt="verified"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </div>

                                                <span className='text-sm font-semibold text-gray-500'>
                                                    이름: {myAgent.userName}
                                                </span>
                                                <span className='text-sm font-semibold text-gray-500'>
                                                    핸드폰번호: {myAgent.userPhoneNumber}
                                                </span>
                                                <span className='text-sm font-semibold text-gray-500'>
                                                    이메일주소: {myAgent.userEmail}
                                                </span>

                                            </div>



                                            {/* button for api call /api/agent/getAccount */}
                                            {/*
                                            <button
                                                disabled={checkingHtxApiKey}
                                                className={` ${checkingHtxApiKey ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-zinc-100'} p-2 rounded text-lg font-semibold`}
                                                onClick={() => {
                                                    checkHtxApiKey(myAgent.apiAccessKey, myAgent.apiSecretKey);
                                                }}
                                            >
                                                HTX API 정보 확인하기
                                            </button>
                                            */}

                                            {/* button for api call /api/agent/getBalance */}

                                            <div className='w-full flex flex-col gap-2
                                                border border-gray-300 p-4 rounded-lg
                                            '>
                                                <button
                                                    disabled={checkingAccountBalance}
                                                    className={` ${checkingAccountBalance ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-zinc-100'} p-2 rounded text-lg font-semibold
                                                        hover:bg-blue-700 hover:text-zinc-100
                                                    `}
                                                    onClick={() => {
                                                        checkAccountBalance(myAgent.apiAccessKey, myAgent.apiSecretKey, myAgent.htxUid);
                                                    }}
                                                >
                                                    HTX 계정 잔고 확인하기
                                                </button>
                                                {checkingAccountBalance && (
                                                    <span className='text-sm font-semibold text-blue-500'>
                                                        HTX 계정 잔고 확인중...
                                                    </span>
                                                )}
                                            
                                                {/*
                                                {accountBalance && (
                                                    <span className='text-xl font-semibold text-gray-500'>
                                                        SPOT 계정 잔고: {accountBalance.toFixed(2)} USDT
                                                    </span>
                                                )}
                                                    */}

                                                {/*
                                                [
                                                    {
                                                        "currency": "USDT",
                                                        "balance": "83.60737576044"
                                                    },
                                                    {
                                                        "currency": "BTC",
                                                        "balance": "0.000000902"
                                                    },
                                                    {
                                                        "currency": "ETH",
                                                        "balance": "0.0000482"
                                                    }
                                                ]
                                                */}
                                                {accountBalanceList && (
                                                    <div className='w-full flex flex-col gap-2'>
                                                        {accountBalanceList.map((account) => (
                                                            <div key={account.currency} className='flex flex-row items-center justify-between gap-2'>
                                                                <span className='text-sm font-semibold text-gray-500'>
                                                                    {account.currency}
                                                                </span>                                                                
                                                                <span className='text-right text-lg font-semibold text-gray-500'>
                                                                    {account.balance}
                                                                </span>


                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                
                                            </div>


                                            {/* button for api call /api/agent/getAssetValuation */}
                                            <div className='w-full flex flex-col gap-2
                                                border border-gray-300 p-4 rounded-lg
                                            '>
                                                <button
                                                    disabled={checkingHtxAssetValuation}
                                                    className={` ${checkingHtxAssetValuation ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-zinc-100'} p-2 rounded text-lg font-semibold
                                                        hover:bg-blue-700 hover:text-zinc-100
                                                    `}
                                                    onClick={() => {
                                                        checkHtxAssetValuation(myAgent.apiAccessKey, myAgent.apiSecretKey);
                                                    }}
                                                >
                                                    HTX 자산 가치 확인하기
                                                </button>
                                                {checkingHtxAssetValuation && (
                                                    <span className='text-sm font-semibold text-blue-500'>
                                                        HTX 자산 가치 확인중...
                                                    </span>
                                                )}
                                            
                                                {htxAssetValuation && (
                                                    <span className='text-right text-2xl font-semibold text-red-500'>
                                                        {
                                                            htxAssetValuation.toLocaleString('ko-KR', {
                                                                style: 'currency',
                                                                currency: 'KRW'
                                                            })
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            {/* button for searchMatchResults */}
                                            <div className='w-full flex flex-col gap-2
                                                border border-gray-300 p-4 rounded-lg
                                            '>
                                                <button
                                                    disabled={searchingMatchResults}
                                                    className={` ${searchingMatchResults ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-zinc-100'} p-2 rounded text-lg font-semibold
                                                        hover:bg-blue-700 hover:text-zinc-100
                                                    `}
                                                    onClick={() => {
                                                        searchMatchResults(myAgent.apiAccessKey, myAgent.apiSecretKey);
                                                    }}
                                                >
                                                    HTX 매치 결과 확인하기
                                                </button>
                                                {searchingMatchResults && (
                                                    <span className='text-sm font-semibold text-blue-500'>
                                                        HTX 매치 결과 확인중...
                                                    </span>
                                                )}

                                                {/*
                                                [{"symbol":"btcusdt","fee-currency":"usdt","source":"spot-android","updated-at":1730784059466,"price":"68378.06","order-id":1195719544670156,"role":"taker","created-at":1730784059466,"filled-amount":"0.000087","filled-fees":"0.01189778244","filled-points":"0.0","fee-deduct-currency":"","fee-deduct-state":"done","match-id":174384101920,"trade-id":103066447911,"id":1159862024172110,"type":"sell-limit"},{"symbol":"btcusdt","fee-currency":"usdt","source":"spot-android","updated-at":1730784059465,"price":"68378.06","order-id":1195719544670156,"role":"taker","created-at":1730784059465,"filled-amount":"0.00046","filled-fees":"0.0629078152","filled-points":"0.0","fee-deduct-currency":"","fee-deduct-state":"done","match-id":174384101920,"trade-id":103066447910,"id":1159862024172109,"type":"sell-limit"},{"symbol":"btcusdt","fee-currency":"btc","source":"spot-android","updated-at":1730783999096,"price":"68381.57","order-id":1195719536250386,"role":"taker","created-at":1730783999096,"filled-amount":"0.000189","filled-fees":"0.000000378","filled-points":"0.0","fee-deduct-currency":"","fee-deduct-state":"done","match-id":174384090807,"trade-id":103066447535,"id":1173744717713267,"type":"buy-limit"},{"symbol":"btcusdt","fee-currency":"btc","source":"spot-android","updated-at":1730783999095,"price":"68381.57","order-id":1195719536250386,"role":"taker","created-at":1730783999095,"filled-amount":"0.00036","filled-fees":"0.00000072","filled-points":"0.0","fee-deduct-currency":"","fee-deduct-state":"done","match-id":174384090807,"trade-id":103066447534,"id":1173744717713268,"type":"buy-limit"}]
                                                */}

                                            
                                                {searchResults && (
                                                    <div className='w-full flex flex-col gap-2'>
                                                        <table className='w-full
                                                            border border-gray-300 rounded-lg
                                                        '>
                                                            <thead className='w-full'>
                                                                <tr className='w-full bg-gray-200'>
                                                                    <th className='w-full border border-gray-300'>
                                                                        time
                                                                    </th>
                                                                    <th className='w-full border border-gray-300'>
                                                                        symbol
                                                                    </th>
                                                                    <th className='w-full border border-gray-300'>
                                                                        price
                                                                    </th>
                                                                    <th className='w-full border border-gray-300'>
                                                                        amount
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className='w-full'>
                                                                {searchResults.map((result) => (
                                                                    <tr key={result.id}
                                                                        className='w-full
                                                                            border border-gray-300
                                                                        '
                                                                    >

                                                                        <td className='w-full
                                                                            border border-gray-300
                                                                        '>
                                                                            {/* 34 minutes ago */}
                                                                            {
                                                                                //result['created-at']

                                                                                // 34 minutes ago


                                                                                new Date().getTime() - result['created-at'] > 1000 * 60 * 60 * 24 ? `${Math.floor((new Date().getTime() - result['created-at']) / 1000 / 60 / 60 / 24)} days ago`
                                                                                    : new Date().getTime() - result['created-at'] > 1000 * 60 * 60 ? `${Math.floor((new Date().getTime() - result['created-at']) / 1000 / 60 / 60)} hours ago`
                                                                                        : new Date().getTime() - result['created-at'] > 1000 * 60 ? `${Math.floor((new Date().getTime() - result['created-at']) / 1000 / 60)} minutes ago`
                                                                                            : new Date().getTime() - result['created-at'] > 1000 ? `${Math.floor((new Date().getTime() - result['created-at']) / 1000)} seconds ago`
                                                                                                : 'just now'
                                                                                

                                                                            }

                                                                        </td>
                                                                        <td className='w-full border border-gray-300'>
                                                                            {result.symbol}
                                                                        </td>
                                                                        <td className='w-full border border-gray-300'>
                                                                            {result.price}
                                                                        </td>
                                                                        <td className='w-full border border-gray-300'>
                                                                            {result['filled-amount']}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>






                                        </div>
                                        


                                    </div>
                                )}


                                {!myAgent && (

                                    <div className='w-full flex flex-col items-center gap-2
                                        border border-gray-300 p-4 rounded-lg
                                    '>
                                        {/* HTX 가입 */}
                                        {/* new window
                                            https://www.htx.com.pk/invite/en-us/1h?invite_code=z73y9223
                                        */}

                                        {/* HTX 거래소에 가입하고 아래 정보를 입력하세요. */}
                                        <div className='flex flex-row items-center gap-2'>
                                            <Image
                                                src="/logo-exchange-htx.png"
                                                alt="HTX"
                                                width={50}
                                                height={50}
                                            />
                                            <span className='text-lg font-semibold text-gray-500'>
                                                HTX 거래소에 가입하고 아래 정보를 입력하세요.
                                            </span>
                                        </div>

                                        <div className='w-full flex flex-col xl:flex-row items-center justify-between gap-2'>
                                            <button
                                                className='w-full bg-blue-500 text-zinc-100 p-2 rounded-lg text-lg font-semibold'
                                                onClick={() => {
                                                    window.open("https://www.htx.com.pk/invite/en-us/1h?invite_code=z73y9223", "_blank");
                                                }}
                                            >
                                                HTX 가입
                                            </button>
                                            {/* HTX 가입 메뉴얼 */}
                                            {/* https://drive.google.com/file/d/1eK_1jIc1PmZxJ-JYnxJKYJohoVqe1Dw9/view */}

                                            <button
                                                className='w-full bg-blue-500 text-zinc-100 p-2 rounded-lg text-lg font-semibold'
                                                onClick={() => {
                                                    window.open("https://drive.google.com/file/d/1eK_1jIc1PmZxJ-JYnxJKYJohoVqe1Dw9/view", "_blank");
                                                }}
                                            >
                                                HTX 가입 메뉴얼
                                            </button>
                                        </div>


                                        {agents.length > 0 && (
                                            <div className='mt-10 w-full flex flex-col items-center gap-2
                                                border border-gray-300 p-4 rounded-lg
                                            '>

                                                <span className='text-lg font-semibold text-blue-500'>
                                                    AI 에이전트를 선택하세요
                                                </span>

                                                <div className='w-full grid grid-cols-2 items-start justify-between gap-2'>

                                                    <div className='flex flex-col gap-2'>
                                                        {agents.map((agent) => (
                                                            <div key={agent.erc721ContractAddress} className='flex flex-row items-center gap-2'>
                                                
                                                                {/*
                                                                <Image
                                                                    src={agent.avatar || "/icon-anonymous.png"}
                                                                    alt="TBOT"
                                                                    width={50}
                                                                    height={50}
                                                                />
                                                                */}

                                                                <input
                                                                    type="radio"
                                                                    value={agent.erc721ContractAddress}
                                                                    name="agent"
                                                                    checked={agent.erc721ContractAddress === agentBot}
                                                                    onChange={(e) => {
                                                                        console.log(e.target.value);

                                                                        //setAgentBot(e.target.value);
                                                                        changeAgentBot(e.target.value);

                                                                    }}
                                                                />

                                                                <Image
                                                                    src={agent.avatar || "/icon-anonymous.png"}
                                                                    alt={agent.nickname}
                                                                    width={50}
                                                                    height={50}
                                                                    className='rounded-full h-4 w-4'
                                                                />

                                                                <span className='text-xs font-semibold text-gray-500'>
                                                                    {
                                                                        //agent.erc721ContractAddress.substring(0, 15) + "..."
                                                                        agent.nickname
                                                                    }
                                                                </span>
                                                                


                                                            </div>

                                                        ))}
                                                    </div>

                                                    <div className='w-full flex flex-col gap-2 h-min-96'>

                                                        {loadingAgentBotList && (
                                                            <div className='flex flex-col items-center gap-2'>
                                                                <Image
                                                                    src="/loading.png"
                                                                    alt="loading"
                                                                    width={50}
                                                                    height={50}
                                                                    className='animate-spin'
                                                                />
                                                                <span className='text-sm font-semibold text-blue-500'>
                                                                    AI 에이전트 목록을 불러오는 중...
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* top left overlapping */}
                                                        {!loadingAgentBotList && agentBotList.map((nft) => (

                                                           
                                                            <div
                                                                key={nft.tokenId}
                                                                className={`flex flex-col items-center gap-2
                                                                    border border-gray-300 p-2 rounded-lg
                                                                    hover:shadow-lg cursor-pointer

                                                                    ${selectedBotNumber === nft.tokenId ? 'bg-blue-500 text-zinc-100' : 'bg-white text-gray-500'}
                                                                `}
                                                                onClick={() => setSelectedBotNumber(nft.tokenId)}
                                                            >



                                                                <Image
                                                                    src={nft.image.thumbnailUrl}
                                                                    alt={nft.name}
                                                                    width={200}
                                                                    height={200}
                                                                    className='rounded-lg w-44'
                                                                />
                                                                <div className='w-full flex flex-col items-start gap-2'>
                                                                    <div className='flex flex-row items-center gap-2'>
                                                                        <span className='text-2xl font-semibold text-red-500'>
                                                                            #{nft.tokenId}
                                                                        </span>
                                                                        {/* opensea link */}
                                                                        <button
                                                                            className='p-2 rounded-lg hover:bg-gray-300'
                                                                            onClick={() => {
                                                                                window.open(
                                                                                    `https://opensea.io/assets/matic/${nft.contract.address}/${nft.tokenId}`,
                                                                                    "_blank"
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Image
                                                                                src="/logo-opensea.png"
                                                                                alt="opensea"
                                                                                width={20}
                                                                                height={20}
                                                                            />
                                                                        </button>
                                                                    </div>
                                                                    <span className='text-sm font-semibold text-yellow-500'>
                                                                        {nft.name}
                                                                    </span>
                                                                    <span className='text-sm font-semibold'>
                                                                        {nft.description}
                                                                    </span>
                                                                    
                                                                    {/* // from now to mint in hours minutes seconds
                                                                    // now - mint */}
                                                                    <span className='text-xs xl:text-lg font-semibold'>
                                                                        Start{' '}{(new Date().getTime() - new Date(nft.mint.timestamp).getTime()) / 1000 / 60 / 60 / 24 > 1
                                                                            ? `${Math.floor((new Date().getTime() - new Date(nft.mint.timestamp).getTime()) / 1000 / 60 / 60 / 24)} days ago`
                                                                            : `${Math.floor((new Date().getTime() - new Date(nft.mint.timestamp).getTime()) / 1000 / 60 / 60)} hours ago`
                                                                        }
                                                                    </span>
                                                                    {/* Accounts */}
                                                                    <span className='text-xs xl:text-lg font-semibold'>
                                                                        Accounts: 163
                                                                    </span>
                                                                    {/* 수익률 */}
                                                                    <span className='text-xs xl:text-lg font-semibold'>
                                                                        ROI: {23.5}%
                                                                    </span>
                                                                    {/* Funds */}
                                                                    <span className='text-xs xl:text-lg font-semibold'>
                                                                        Funds: 53650 USDT
                                                                    </span>


                                                                </div>
                                                            </div>

                                                     
                                                        ))}
                                                    </div>




                                                </div>
                                            </div>
                                        )}

                                        {/* input for apply */}
                                        {/* 이름, 핸드폰번호, 이메일주소, HTX UID, HTX USDT(TRON) 지갑주소 */}
                                        {/* API Access Key, API Secret Key */}



                                        <div className='w-full flex flex-col gap-2
                                            border border-gray-300 p-4 rounded-lg
                                        '>

                                            <span className='text-sm font-semibold text-gray-500'>
                                                HTX API Access Key
                                            </span>
                                            <input
                                                disabled={applyingMintNFT}
                                                onChange={(e) => setApiAccessKey(e.target.value)}
                                                type="text"
                                                placeholder="API Access Key"
                                                className="w-full p-2 rounded-lg border border-gray-300"
                                            />
                                            <span className='text-sm font-semibold text-gray-500'>
                                                HTX API Secret Key
                                            </span>
                                            <input
                                                disabled={applyingMintNFT}
                                                onChange={(e) => setApiSecretKey(e.target.value)}
                                                type="text"
                                                placeholder="API Secret Key"
                                                className="w-full p-2 rounded-lg border border-gray-300"
                                            />

                                            {/* button for api call /api/agent/getAccount */}
                                            <button
                                                disabled={checkingHtxApiKey || !apiAccessKey || !apiSecretKey || isValidAPIKey}
                                                className={` ${checkingHtxApiKey || !apiAccessKey || !apiSecretKey || isValidAPIKey
                                                    ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-zinc-100'} p-2 rounded text-lg font-semibold`}
                                                onClick={() => {
                                                    checkHtxApiKey(apiAccessKey, apiSecretKey);
                                                }}
                                            >
                                                HTX API 정보 확인하기
                                            </button>

                                            {checkingHtxApiKey && (
                                                <span className='text-sm font-semibold text-blue-500'>
                                                    HTX API Key 확인중...
                                                </span>
                                            )}

                                            {isValidAPIKey && (
                                                <span className='text-sm font-semibold text-green-500'>
                                                    HTX API Key가 확인되었습니다.
                                                </span>
                                            )}

                                        </div>

                                        <div className='w-full flex flex-col gap-2 border border-gray-300 p-4 rounded-lg'>
                                            <span className='text-sm font-semibold text-gray-500'>
                                                HTX UID
                                            </span>
                                            <input
                                                disabled={true}
                                                value={htxUid}
                                                onChange={(e) => setHtxUid(e.target.value)}
                                                type="text"
                                                placeholder="HTX UID"
                                                className="w-full p-2 rounded-lg border border-gray-300"
                                            />
                                        </div>


                                        {/* check account balance */}
                                        <div className='w-full flex flex-col gap-2 border border-gray-300 p-4 rounded-lg'> 
                                            <span className='text-sm font-semibold text-gray-500'>
                                                계정 잔고(USDT) 확인하기
                                            </span>
                                            <button
                                                disabled={!isValidAPIKey || checkingAccountBalance}
                                                onClick={() => {
                                                    checkAccountBalance(apiAccessKey, apiSecretKey, htxUid);
                                                }}
                                                className={` ${!isValidAPIKey || checkingAccountBalance ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-zinc-100'} p-2 rounded text-lg font-semibold`}
                                            >
                                                계정 잔고 확인하기
                                            </button>

                                            {checkingAccountBalance && (
                                                <span className='text-sm font-semibold text-blue-500'>
                                                    계정 잔고 확인중...
                                                </span>
                                            )}

                                            {/*
                                            {accountBalance && (
                                                <span className='text-2xl font-semibold text-gray-500'>
                                                    계정 잔고: {accountBalance.toFixed(2)} USDT
                                                </span>
                                            )}
                                            */}
                                            {accountBalanceList && (
                                                <div className='w-full flex flex-col gap-2'>
                                                    {accountBalanceList.map((account) => (
                                                        <div key={account.currency} className='flex flex-row items-center gap-2'>
                                                            <span className='text-sm font-semibold text-gray-500'>
                                                                {account.currency}: {account.balance}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/*}
                                            {isValidBalance ? (
                                                <span className='text-sm font-semibold text-green-500'>
                                                    계정 잔고가 100 USDT 이상입니다.
                                                </span>
                                            ) : (
                                                <span className='text-sm font-semibold text-red-500'>
                                                    계정 잔고가 100 USDT 미만입니다. 100 USDT 이상 입금해주세요.
                                                </span>
                                            )}
                                            */}

                                        </div>

                                        {/* HTX USDT(TRON) 지갑주소 */}


                                        <div className='w-full flex flex-col gap-2'>
                                            <span className='text-sm font-semibold text-gray-500'>
                                                HTX USDT(TRON) 지갑주소
                                            </span>
                                            <input
                                                disabled={applyingMintNFT}
                                                onChange={(e) => setHtxUsdtWalletAddress(e.target.value)}
                                                type="text"
                                                placeholder="HTX USDT(TRON) 지갑주소"
                                                className="w-full p-2 rounded-lg border border-gray-300"
                                            />
                                        </div>


                                        <div className='w-full flex flex-col gap-2 border border-gray-300 p-4 rounded-lg'>
                                            <span className='text-sm font-semibold text-gray-500'>
                                                이름, 핸드폰번호, 이메일주소
                                            </span>

                                            <input
                                                disabled={applyingMintNFT}
                                                value={userName}
                                                onChange={(e) => setUserName(e.target.value)}
                                                type="text"
                                                placeholder="이름"
                                                className="w-full p-2 rounded-lg border border-gray-300"
                                            />
                                            <input
                                                disabled={applyingMintNFT}
                                                value={userPhoneNumber}
                                                onChange={(e) => setUserPhoneNumber(e.target.value)}
                                                type="text"
                                                placeholder="핸드폰번호"
                                                className="w-full p-2 rounded-lg border border-gray-300"
                                            />
                                            <input
                                                disabled={applyingMintNFT}
                                                value={userEmail}
                                                onChange={(e) => setUserEmail(e.target.value)}
                                                type="text"
                                                placeholder="이메일주소"
                                                className="w-full p-2 rounded-lg border border-gray-300"
                                            />
                                        </div>



                                        {/* button for apply */}


                                        <button
                                            disabled={applyingMintNFT || !isValidAPIKey || !isValidBalance}
                                            onClick={applyMintAgentBot}
                                            className={` ${applyingMintNFT || !isValidAPIKey || !isValidBalance ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-zinc-100'} p-2 rounded text-lg font-semibold`}
                                        >
                                            {applyingMintNFT ? "AI 에이전트 NFT 신청중..." : "AI 에이전트 NFT 민팅 신청"}
                                        </button>
                                        

                                    </div>

                                )}


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


                        <div className='flex flex-col xl:flex-row gap-5 items-center xl:items-start justify-between border
                         border-blue-500 p-4 rounded-lg'>
                            <div className='flex flex-row items-center gap-2'>
                                {/* dot */}
                                <div className='w-4 h-4 bg-red-500 rounded-full'></div>
                                <span className='text-2xl font-semibold text-blue-500'>
                                    1000 TBOT
                                </span>
                            </div>
                            <div className='flex flex-col items-center gap-2
                                border border-gray-300 p-4 rounded-lg
                            '>
                                <div className='flex flex-row items-center gap-2'>
                                    <Image
                                        src="/logo-tbot-1000.png"
                                        alt="TBOT"
                                        width={200}
                                        height={200}
                                    />
                                </div>
                                {/* button for buy */}
                                {/* 121 USDT BUY */}
                                <button
                                    onClick={() => {
                                        toast.error("잔고가 부족합니다. 1000 TBOT을 구매하려면 1,210 USDT가 필요합니다.");
                                    } }
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
                                <span className='text-lg font-semibold text-blue-500 mt-2'>
                                    계정 운영 방식
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 본인 거래소 계정에서 직접 자금 관리
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 최소 운영자금: 1000 USDT
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

                        <div className='flex flex-col xl:flex-row gap-5 items-center xl:items-start justify-between border
                        border-red-500 p-4 rounded-lg'>
                            <div className='flex flex-row items-center gap-2'>
                                {/* dot */}
                                <div className='w-4 h-4 bg-red-500 rounded-full'></div>
                                <span className='text-2xl font-semibold text-blue-500'>
                                    10000 TBOT
                                </span>
                            </div>
                            <div className='flex flex-col items-center gap-2
                                border border-gray-300 p-4 rounded-lg
                            '>
                                <div className='flex flex-row items-center gap-2'>
                                    <Image
                                        src="/logo-tbot-10000.png"
                                        alt="TBOT"
                                        width={200}
                                        height={200}
                                    />
                                </div>
                                {/* button for buy */}
                                {/* 121 USDT BUY */}
                                <button
                                    onClick={() => {
                                        toast.error("잔고가 부족합니다. 10000 TBOT을 구매하려면 12,100 USDT가 필요합니다.");
                                    } }
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
                                <span className='text-lg font-semibold text-blue-500 mt-2'>
                                    계정 운영 방식
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 본인 거래소 계정에서 직접 자금 관리
                                </span>
                                <span className='text-sm text-gray-500'>
                                    • 최소 운영자금: 10000 USDT
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


                {/* select agent */}



            </div>

        </main>

    );

}

          




function Header(
    {
        agent,
    } : {
        agent: string
    }
) {

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
                    router.push('/kr/tron/?agent=' + agent);
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
                    "/kr/polygon/tbot?agent=" + agent
                  );
              }}
              className="text-gray-600 hover:underline text-xs xl:text-lg"
            >
              TBOT
            </button>
            <button
              onClick={() => {
                router.push('/kr/polygon/profile-settings?agent=' + agent);
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