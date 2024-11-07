import { NextResponse, type NextRequest } from "next/server";

import { Network, Alchemy } from 'alchemy-sdk';

import { getApplicationsByAgent } from '@lib/api/agent';

export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    erc721ContractAddress,
    tokenId
  } = body;


  if (!erc721ContractAddress || !tokenId) {

    return NextResponse.error();
  }


  const response = await getApplicationsByAgent({
    erc721ContractAddress,
    tokenId
  });


  if (!response) {
    return NextResponse.json({
      result: [],
    });
    
  }

 
  return NextResponse.json({

    result: response,
    
  });
  
}
