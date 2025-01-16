import { NextResponse, type NextRequest } from "next/server";



import {
    getStatisticsDailyTradingBalanceAndVolume
} from '@lib/api/agent';


export async function POST(request: NextRequest) {

    const body = await request.json();



    const result = await getStatisticsDailyTradingBalanceAndVolume();


    return NextResponse.json({

        result,

    });

}
