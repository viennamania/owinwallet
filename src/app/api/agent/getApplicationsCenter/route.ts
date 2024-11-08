import { NextResponse, type NextRequest } from "next/server";



import {
	getAllAgents,
} from '@lib/api/agent';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress } = body;


  if (!walletAddress) {

    return NextResponse.error();
  }

  if (walletAddress === "0x7bfF3359841D26C8046364b93E7dA01886ae1c22"

      || walletAddress === "0x5Cb2D01Cd138D9aB7a7435A85e8B12b0B2852A7a" // center
    
    ) {

      const result = await getAllAgents({});
 
      return NextResponse.json({
    
        result,
        
      });


  } else {

    return NextResponse.error();

  }


  
}
