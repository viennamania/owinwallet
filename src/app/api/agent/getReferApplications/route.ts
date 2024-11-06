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


  if (!agentBot) {

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
