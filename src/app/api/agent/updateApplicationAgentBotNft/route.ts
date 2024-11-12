import { NextResponse, type NextRequest } from "next/server";

import {
	updateAgentBotNft,
} from '@lib/api/agent';



export async function POST(request: NextRequest) {

  const body = await request.json();


  const { applicationId, agentBotNft } = body;



  const result = await updateAgentBotNft({
    applicationId: applicationId,
    agentBotNft: agentBotNft,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
