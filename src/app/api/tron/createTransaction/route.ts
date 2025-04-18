import { NextResponse, type NextRequest } from "next/server";

import { TronWeb, utils as TronWebUtils, Trx, TransactionBuilder, Contract, Event, Plugin } from 'tronweb';

import { getOneByWalletAddress } from '@lib/api/user';

export async function POST(request: NextRequest) {

  const body = await request.json();

  const {

    walletAddress,
    toWalletAddress,
    amount,

  } = body;

  /*

const tronWeb = new TronWeb(

    fullHost: "trongrid address according to the preferred testnet or mainnet",

    headers:  "TRON-PRO-API-KEY": AppKey ,

    privateKey: "The Sender's Private Key",

);



const options = 

    feeLimit: 10000000,

    callValue: 0

;



const tx = await tronWeb.transactionBuilder.triggerSmartContract(

    "TRC-20 Contract Address according to network you use", 'transfer(address,uint256)', options,

    [

      type: 'address',

      value: "Account Address of the Receiver"

    , 

      type: 'uint256',

      value: (Amount) * 1000000

    ],

    tronWeb.address.toHex("Account Address of the sender")

);



const signedTx = await tronWeb.trx.sign(tx.transaction);

const broadcastTx = await tronWeb.trx.sendRawTransaction(signedTx);


  */
  
 

  const user = await getOneByWalletAddress(walletAddress);

  if (!user) {
    return NextResponse.json({
      result: null,
    });
  }

  const fromWalletAddress = user?.tronWalletAddress;
  const tronWalletPrivateKey = user?.tronWalletPrivateKey;

  //console.log("fromWalletAddress", fromWalletAddress);
  //console.log("tronWalletPrivateKey", tronWalletPrivateKey);


  // USDT contract address
  const contractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

  try {

    const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io',
      headers: {
        'TRON-PRO-API-KEY': process.env.TRONGRID_API_KEY,
      },
      privateKey: tronWalletPrivateKey,
    });




    const tx = await tronWeb.transactionBuilder.triggerSmartContract(
      //"TRC-20 Contract Address according to network you use",
      //'transfer(address,uint256)',

      contractAddress,
      'transfer(address,uint256)',
      {
        
        //feeLimit: 10000000,
        feeLimit: 1e9,

        callValue: 0
      },
      [
        {
          type: 'address',
          value: toWalletAddress
        },
        {
          type: 'uint256',
          value: amount * 1000000
        }
      ],
      tronWeb.address.toHex(fromWalletAddress)
    );

    const signedTx = await tronWeb.trx.sign(tx.transaction);

    const broadcastTx = await tronWeb.trx.sendRawTransaction(signedTx);


    //console.log("broadcastTx", broadcastTx);

    if (!broadcastTx || !broadcastTx.transaction || !broadcastTx.transaction.txID) {
      return NextResponse.json({
        result: null,
      });
    }


  
    return NextResponse.json({

      result: {
        transactionHash: broadcastTx.transaction.txID,
      },
      
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      result: null,
    });

  }
  
}
