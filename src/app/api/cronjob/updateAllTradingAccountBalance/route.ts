import { NextResponse, type NextRequest } from "next/server";

import moment from 'moment';


import {
  getAllAgentsForAILabs,
  //getAllAgentsForLive,
	updateTradingAccountBalance,
  updateAssetBalance,
} from '@lib/api/agent';


import twilio from "twilio";



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


 // when 10, 12, 14, 16, 18, 20 hours


  let sendSms = false;

  if (moment().minute() === 0) {

    if (moment().hour() === 10 || moment().hour() === 12 || moment().hour() === 14 || moment().hour() === 16 || moment().hour() === 18 || moment().hour() === 20 ) {
      sendSms = true;
    }

  }


  


  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  

  const result = await getAllAgentsForAILabs({
    limit: 200,
    page: 1,
  });

  const applications = result?.applications || [];


  for (let i = 0; i < applications.length; i++) {
    const application = applications[i];
    const { id, apiAccessKey, apiSecretKey, apiPassword, userPhoneNumber } = application;

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

            

            //console.log(`\nTrading account: $${balance}`);

            // check each hour is on the hour

            //if (moment.valueOf() % 3600000 === 0) {

            if (sendSms) {


              if (balance > 0 && userPhoneNumber.length > 10 && userPhoneNumber.startsWith("+")) {


                try {


                  const balanceStr = Number(balance).toFixed(2);





                  const msgBody = `[TBOT] Your trading account balance is $${balanceStr}`;
              
                  const message = await client.messages.create({
                    body: msgBody,
                    from: "+17622254217",
                    to: userPhoneNumber
                  });
              
                  //console.log(message.sid);
            
                } catch (error) {
                    
                  console.log("error", error);
              
                }


              }

            } else {
              //console.log("skip sending sms");
            }


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

            const assetBalance = {
              balanes: fundingInfo.data,
              timestamp: moment().valueOf(),
            } 

            await updateAssetBalance({
              applicationId: id,
              assetBalance: assetBalance,
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
