import { NextResponse, type NextRequest } from "next/server";


import { TronWeb, utils as TronWebUtils, Trx, TransactionBuilder, Contract, Event, Plugin } from 'tronweb';


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { lang, chain, tronWalletAddress } = body;

  
  // USDT contract address
  const contractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
  // USDT balanceOf function signature



  try {

    const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io',
      /*
      headers: {
        'TRON-PRO-API-KEY': process.env.TRONGRID_API_KEY,
      },
      */
    });

    //const balance = await tronWeb.trx.getBalance(tronWalletAddress);

    const contract = await tronWeb.contract().at(contractAddress);

    console.log("contract", contract);
    

    const balance = await contract.balanceOf(tronWalletAddress).call();



    console.log("balance", balance);





    const usdtBalance = tronWeb.fromSun(balance);

    console.log("usdtBalance", usdtBalance);

    return NextResponse.json({
      result: {
        usdtBalance: usdtBalance,
      }
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      result: null,
    });

  }



}
