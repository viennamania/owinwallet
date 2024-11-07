import { NextResponse, type NextRequest } from "next/server";



import {
	getMyReferAgents,
} from '@lib/api/agent';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    agentBot,
    agentBotNumber,
  } = body;

  console.log("agentBot: ", agentBot);
  console.log("agentBotNumber: ", agentBotNumber);


  if (!agentBot || !agentBotNumber) {
    return NextResponse.error();
  }




  const result = await getMyReferAgents({
    page: 1,
    limit: 10,
    agentBot: agentBot,
    agentBotNumber: agentBotNumber,
  });
 
  return NextResponse.json({

    result,
    
  });
  
}
