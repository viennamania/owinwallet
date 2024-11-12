import { NextResponse, type NextRequest } from "next/server";

import {
	insertOne,
} from '@lib/api/agent';



export async function POST(request: NextRequest) {

  const body = await request.json();

  /*
  walletAddress: address,
  agentBot: agentBot,
  userName: userName,
  userPhoneNumber: userPhoneNumber,
  userEmail: userEmail,
  htxUid: htxUid,
  htxUsdtWalletAddress: htxUsdtWalletAddress,
  apiAccessKey: apiAccessKey,
  apiSecretKey: apiSecretKey,
  */

  const { walletAddress, agentBot, agentBotNumber, userName, userPhoneNumber, userEmail, htxUserId, htxUsdtWalletAddress, apiAccessKey, apiSecretKey } = body;



  const result = await insertOne({
    walletAddress: walletAddress,
    agentBot: agentBot,
    agentBotNumber: agentBotNumber,
    userName: userName,
    userPhoneNumber: userPhoneNumber,
    userEmail: userEmail,
    htxUserId: htxUserId,
    htxUsdtWalletAddress: htxUsdtWalletAddress,
    apiAccessKey: apiAccessKey,
    apiSecretKey: apiSecretKey,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
