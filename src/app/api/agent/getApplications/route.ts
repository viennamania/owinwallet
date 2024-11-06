import { NextResponse, type NextRequest } from "next/server";

import {
	getAllAgents,
} from '@lib/api/agent';



export async function POST(request: NextRequest) {

  const body = await request.json();




  const result = await getAllAgents({});


 
  return NextResponse.json({

    result,
    
  });
  
}
