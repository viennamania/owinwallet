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
      || walletAddress === "0xFb580c68794A963632FF272ab5A7233ee6114fef"
      || walletAddress === "0x3e3E906e33D25cecA1aee550CACB1bCE74450Ed6"
    
    ) {

      const result = await getAllAgents({});
 
      return NextResponse.json({
    
        result,
        
      });


  } else {

    return NextResponse.error();

  }


  
}
