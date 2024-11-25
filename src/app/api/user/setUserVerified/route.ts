import { NextResponse, type NextRequest } from "next/server";

import {
	insertOneVerified,
} from '@lib/api/user';



export async function POST(request: NextRequest) {

  const body = await request.json();


  const {
    walletAddress,
    nickname,
    userType,
    mobile,
    telegramId,
  } = body;

  /*
  console.log('walletAddress', walletAddress);
  console.log('nickname', nickname);
  console.log('userType', userType);
  console.log('mobile', mobile);
  console.log('telegramId', telegramId);
  */



  const result = await insertOneVerified({
    walletAddress: walletAddress,
    nickname: nickname,
    userType: userType,
    mobile: mobile,
    telegramId: telegramId,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
