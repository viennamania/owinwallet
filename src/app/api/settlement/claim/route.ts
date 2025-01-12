import { NextResponse, type NextRequest } from "next/server";

import {
	setSettlementClaim,
} from '@lib/api/agent';



export async function POST(request: NextRequest) {

  const body = await request.json();


  const { applicationId } = body;



  
  const result = await setSettlementClaim({
    applicationId: applicationId,
  });
  
  if (!result) {
    return NextResponse.error();
  }

 
  return NextResponse.json({

    result: result,
    
  });
  
}
