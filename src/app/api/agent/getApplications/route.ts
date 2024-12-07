import { NextResponse, type NextRequest } from "next/server";



import {
	getAllAgentsForAILabs,
} from '@lib/api/agent';
import { stat } from "fs";



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress } = body;


  
  if (!walletAddress) {

    return NextResponse.error();

  }
  
  //console.log("walletAddress", walletAddress);

  if (
      
      
      walletAddress === "0x7bfF3359841D26C8046364b93E7dA01886ae1c22"
      || walletAddress === "0xFb580c68794A963632FF272ab5A7233ee6114fef"

      || walletAddress === "0x2C91bf7ac8300913367Bf1c29b14c25556c0df92" // wayne owin telegram

      || walletAddress === "0x0d2846FDbaAc5e9526f9409aE18d3e2c9CdC9466" // wayne

      // AI Labs
      || walletAddress === "0x40fa492D30815F17BD83B6945103AEfbe7B92EBe" // AI Labs
      || walletAddress === "0x3e3E906e33D25cecA1aee550CACB1bCE74450Ed6"
      || walletAddress === "0xE052B4f1B6842d422Debf17eB5361138830d6c1c"
      || walletAddress === "0x78d937Ec95f1674BF9E43d90D6231f504AC2D6c3"

      || walletAddress === "0xaB6fB9F80469511195Db7Ac707Cb3F4aD99b1755" // center

    
    ) {

      
      const result = await getAllAgentsForAILabs({
        limit: 200,
        page: 1,
      });
      

 
      return NextResponse.json({
        status: "success",
        result: result,
      });


  } else {

    return NextResponse.error();
    

  }


  
}
