import { NextResponse, type NextRequest } from "next/server";

import {
  updateOkxUid
} from '@lib/api/agent';



import axios from 'axios';
import * as crypto from 'crypto';

const BASE_URL = 'https://www.okx.com';


/*
async function getOkxAccountInfo(apiAccessKey: string, apiSecretKey: string, apiPassword: string) {
    // API 인증 정보
    const API_KEY = '22af6f87-3b35-4a79-bed2-053099d259c4';
    const SECRET_KEY = '5805FDF5696621F041E3CD9D6C3AB8CB';
    const PASSPHRASE = '#Pado2024';

    const BASE_URL = 'https://www.okx.com';

    async function makeRequest(endpoint: string): Promise<any> {
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

    try {
        // UID 조회 부분
        const accountInfo = await makeRequest('/api/v5/account/config');
        if (accountInfo && accountInfo.code === '0') {
            const uid = accountInfo.data?.[0]?.uid;
            if (uid) {
                console.log(`\nUID: ${uid}`);
            }
        }

        // Trading 계좌 조회
        const tradingInfo = await makeRequest('/api/v5/account/balance');
        if (tradingInfo && tradingInfo.code === '0') {
            console.log(`\nTrading account: $${tradingInfo.data?.[0]?.totalEq || '0'}`);
        }

        // Funding 계좌 조회
        const fundingInfo = await makeRequest('/api/v5/asset/balances');
        if (fundingInfo && fundingInfo.code === '0') {
            console.log('\nFunding account:');
            fundingInfo.data.forEach((asset: any) => {
                if (parseFloat(asset.availBal || '0') > 0) {
                    console.log(`  ${asset.ccy}: ${asset.availBal}`);
                }
            });
        }
    } catch (error : any) {
        console.error(`처리 오류: ${error.message}`);
    }
}
*/



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



export async function POST(request: NextRequest) {

  const body = await request.json();

  
  const {
    applicationId,
    apiAccessKey,
    apiSecretKey,
    apiPassword,
   } = body;
  

    if (!applicationId || !apiAccessKey || !apiSecretKey || !apiPassword) {
        return NextResponse.json({
            result: {
            status: "error",
            }
        });
    }



    //console.log(body);


    try {


      // Trading 계좌 조회
      /*
      const tradingInfo = await makeRequest(
        '/api/v5/account/balance',
        apiAccessKey,
        apiSecretKey,
        apiPassword,
      );
      if (tradingInfo && tradingInfo.code === '0') {
          console.log(`\nTrading account: $${tradingInfo.data?.[0]?.totalEq || '0'}`);
      }


      // Funding 계좌 조회
      const fundingInfo = await makeRequest(
        '/api/v5/asset/balances',
        apiAccessKey,
        apiSecretKey,
        apiPassword,
      );
      if (fundingInfo && fundingInfo.code === '0') {
          console.log('\nFunding account:');
          fundingInfo.data.forEach((asset: any) => {
              if (parseFloat(asset.availBal || '0') > 0) {
                  console.log(`  ${asset.ccy}: ${asset.availBal}`);
              }
          });
      }
      */





      // UID 조회 부분
      const accountInfo = await makeRequest(
        '/api/v5/account/config',
        apiAccessKey,
        apiSecretKey,
        apiPassword,
      );

      if (accountInfo && accountInfo.code === '0') {
          const uid = accountInfo.data?.[0]?.uid;
          if (uid) {
              console.log(`\nUID: ${uid}`);

              await updateOkxUid({
                applicationId,
                okxUid: uid,
              });

              return NextResponse.json({
                result: {
                  status: "ok",
                  okxUid: uid,
                },
              });


          }
      }




    } catch (error) {
        console.error("error", error);


    }




    await updateOkxUid({
      applicationId,
      okxUid: "0",
    });

    return NextResponse.json({
        result: {
          status: "ok",
          okxUid: "0",
        },
    });



    /*
    //const HOST = 'api.huobipro.com';
    
    const HOST = 'api.huobi.pro';

    ///const HOST = 'hapi.hbdm.com';



    const DEFAULT_HEADERS = {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36"
    };


    const path = `/v2/user/uid`;



    ////const path = "/api/v1/contract_account_info";


    const huobiBody: { [key: string]: string | number | undefined } = {
        AccessKeyId: htxAccessKey,
        SignatureMethod: "HmacSHA256",
        SignatureVersion: 2,
        Timestamp: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
    };


    // var payload = sign_sha('GET', HOST, path, huobiBody);

    //const payload = sign_sha('GET', HOST, path, huobiBody);

    try {


      var p = '';

      var pars = [];
      for (let item in huobiBody) {
          const value = huobiBody[item];
          if (value !== undefined) {
              pars.push(item + "=" + encodeURIComponent(value));
          }
          p = pars.sort().join("&");
          var meta = ['GET', HOST, path, p].join('\n');
          
          var hash = HmacSHA256(meta, htxSecretKey);

          var Signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));
          p += `&Signature=${Signature}`;
      }

      console.log(p);




      const response = await fetch(`https://${HOST}${path}?${p}`, {
          method: 'GET',
          headers: DEFAULT_HEADERS,
      });

      if (!response) {
          return NextResponse.json({
              result: {
                  status: "error",
              },
          });
      }

      const data = await response.json();

      ///console.log(data);


      if (data.code === 200) {

        const htxUid = data.data as number;

        const result = await updateHtxUid({ applicationId, htxUid });

        if (result) {
          return NextResponse.json({
            result: {
              status: "ok",
              htxUid: htxUid,
            },
          });
        }
      }
      
      
    } catch (error) {
        console.error("error", error);
    }

 
    return NextResponse.json({
      result: {
          status: "error",
      },
    });
    */
  
}