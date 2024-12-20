import { NextResponse, type NextRequest } from "next/server";

import moment from 'moment';


import {
  getAllAgentsForAILabs,
	updateTradingAccountBalance,
  updateAssetBalance,
} from '@lib/api/agent';



import axios from 'axios';
import * as crypto from 'crypto';

const BASE_URL = 'https://www.okx.com';




async function makeRequest(
  endpoint: string,
  API_KEY: string,
  SECRET_KEY: string,
  PASSPHRASE: string,
): Promise<any> {
  const timestamp = new Date().toISOString();
  const message = timestamp + 'GET' + endpoint;

  const signature = crypto.createHmac('sha256', SECRET_KEY)
      .update(message)
      .digest('base64');

  const headers = {
      'OK-ACCESS-KEY': API_KEY,
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': PASSPHRASE,
      'Content-Type': 'application/json',
  };

  try {
      const response = await axios.get(BASE_URL + endpoint, { headers });
      return response.data;
  } catch (error : any) {
      console.error(`API 요청 오류: ${error?.message}`);
      return null;
  }
}



export const maxDuration = 300; // This function can run for a maximum of 600 seconds
export const dynamic = 'force-dynamic';


export async function GET(request: NextRequest) {



  const result = await getAllAgentsForAILabs({
    limit: 200,
    page: 1,
  });

  const applications = result?.applications || [];


  for (let i = 0; i < applications.length; i++) {
    const application = applications[i];
    const { id, apiAccessKey, apiSecretKey, apiPassword } = application;

    if (apiAccessKey && apiSecretKey && apiPassword) {

      try {
        const tradingInfo = await makeRequest(
          '/api/v5/account/balance',
          apiAccessKey,
          apiSecretKey,
          apiPassword,
        );
        if (tradingInfo && tradingInfo.code === '0') {
            
            //console.log(`\nTrading account: $${tradingInfo.data?.[0]?.totalEq || '0'}`);
  
            const balance = tradingInfo.data?.[0]?.totalEq || '0';
  
            const tradingAccountBalance = {
              balance: balance,
              timestamp: moment().valueOf(),
            };
  
            await updateTradingAccountBalance({
              applicationId: id,
              tradingAccountBalance: tradingAccountBalance,
            });


        }


      } catch (error : any) {
        console.error(`API 요청 오류: ${error?.message}`);
      }




      try {

        // Funding 계좌 조회
        const fundingInfo = await makeRequest(
          '/api/v5/asset/balances',
          apiAccessKey,
          apiSecretKey,
          apiPassword,
        );
        if (fundingInfo && fundingInfo.code === '0') {
            
            //console.log('\nFunding account: ', fundingInfo);


            await updateAssetBalance({
              applicationId: id,
              assetBalance: fundingInfo.data,
            });

  
        }



      } catch (error : any) {
        console.error(`API 요청 오류: ${error?.message}`);
      }

    }

  }

  
  return NextResponse.json({
    result: {
      status: "ok",
    }
  });


  
}
