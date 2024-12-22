import { create } from 'domain';
import clientPromise from '../mongodb';
import { N } from 'ethers';
import exp from 'constants';
import { approve } from 'thirdweb/extensions/erc20';
import { parse } from 'path';
import { start } from 'repl';


export interface AgentProps {
  id: number;
  walletAddress: string;
  agentBot: string;
  userName: string;
  userPhoneNumber: string;
  userEmail: string;
  htxUid: string;
  htxUsdtWalletAddress: string;
  apiAccessKey: string;
  apiSecretKey: string;

}

export interface ResultProps {
  totalCount: number;
  users: AgentProps[];
}


/*
    walletAddress: walletAddress,
    agentBot: agentBot,
    userName: userName,
    userPhoneNumber: userPhoneNumber,
    userEmail: userEmail,
    htxUid: htxUid,
    htxUsdtWalletAddress: htxUsdtWalletAddress,
    apiAccessKey: apiAccessKey,
    apiSecretKey: apiSecretKey,
*/

export async function insertOne(data: any) {

  //console.log('insertOne data: ' + JSON.stringify(data));
  



  if (!data.walletAddress
    || !data.agentBot
    /////|| !data.agentBotNumber  => if agentBotNumber is 0, it will be false
    || !data.userName
    || !data.userEmail

    //|| !data.htxUserId
    
    //////|| !data.htxUsdtWalletAddress

    || !data.apiAccessKey
    || !data.apiSecretKey
    || !data.apiPassword) {
    return null;
  }





  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');


  try {

  /*
  // check if walletAddress exists
  const checkWalletAddress = await collection.findOne({ walletAddress: data.walletAddress });
  
  ////console.log('checkWalletAddress: ' + JSON.stringify(checkWalletAddress));

  
  if (checkWalletAddress) {

    console.log('checkWalletAddress exists: ' + JSON.stringify(checkWalletAddress));
    return null;
  }
  */

  



  // generate id 100000 ~ 999999

  const id = Math.floor(Math.random() * 900000) + 100000;





  const result = await collection.insertOne(

    {
      id: id,
      walletAddress: data.walletAddress,
      agentBot: data.agentBot,
      
      ///agentBotNumber: data.agentBotNumber,
      agentBotNumber: parseInt(data.agentBotNumber),

      userName: data.userName,
      userPhoneNumber: data.userPhoneNumber,
      userEmail: data.userEmail,
      userTelegramId: data.userTelegramId,
      exchange: data.exchange,
      
      okxUid: data.okxUid,
      accountConfig: data.accountConfig,

      htxUsdtWalletAddress: data.htxUsdtWalletAddress,
      apiAccessKey: data.apiAccessKey,
      apiSecretKey: data.apiSecretKey,
      apiPassword: data.apiPassword,

      marketingCenter: data.marketingCenter,
      center: data.center,

      createdAt: new Date().toISOString(),
    }
  );


  ///console.log('insertOne result: ' + JSON.stringify(result));



  if (result) {
    return {
      id: id,
      walletAddress: data.walletAddress,
      agentBot: data.agentBot,
      agentBotNumber: data.agentBotNumber,
      userName: data.userName,
      userPhoneNumber: data.userPhoneNumber,
      userEmail: data.userEmail,
      userTelegramId: data.userTelegramId,
      
      //htxUserId: data.htxUserId,
      okxUid: data.okxUid,
      accountConfig: data.accountConfig,

      htxUsdtWalletAddress: data.htxUsdtWalletAddress,
      apiAccessKey: data.apiAccessKey,
      apiSecretKey: data.apiSecretKey,
      apiPassword: data.apiPassword,

      center: data.center,

    };
  } else {
    return null;
  }

  } catch (e) {
    console.log('insertOne error: ' + e);
    return null;
  }

}



// getAllAgents
// sort by createdAt desc
export async function getAllAgents({
  marketingCenter = '',
  page = 1,
  limit = 200,
}) {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');


  if (!marketingCenter) {
    // get agents which center is not defined
    const result = await collection.find(
      {
        /*
        $or: [
          center: { $exists: false }
        ]
        */

        $or: [
          { marketingCenter: { $exists: false } },
          { marketingCenter: '' },
        ]


      },
      {
        sort: { createdAt: -1 },
        skip: (page - 1) * limit,
        limit: limit,
      },
    ).toArray();

    if (result) {
      return {
        totalCount: result.length,
        applications: result,
      };
    } else {
      return null;
    }

  } else {
 
    // get agents which center is defined
    const result = await collection.find(
      {
        marketingCenter: marketingCenter,
      },
      {
        sort: { createdAt: -1 },
        skip: (page - 1) * limit,
        limit: limit,
      },
    ).toArray();

    if (result) {
      return {
        totalCount: result.length,
        applications: result,
      };
    } else {
      return null;
    }

  }
  
}







// getAllAgents
// sort by createdAt desc
export async function getAllAgentsForAILabs({ page = 1, limit = 100 }) {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');

  try {


    // check apiPassword is exists

    const result = await collection.aggregate([
      {
        $match: {
          ///apiPassword: { $exists: true },
          exchange: 'okx',
        }
      },
      {
        $sort: {
          createdAt: -1,
        }
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    
    ]).toArray();


    if (result) {


      // total count
      const totalCount = await collection.find(
        {
          ///apiPassword: { $exists: true },
          exchange: 'okx',
        },
      ).count();


      // sum of total trandingAccountBalance.balance is string convert to number

      const totalTradingAccountBalance = await collection.aggregate([
        {
          $match: {
            ///apiPassword: { $exists: true },
            exchange: 'okx',
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: { $toDouble: "$tradingAccountBalance.balance" } },
          }
        }
      ]).toArray();

      ///console.log('totalTradingAccountBalance: ' + JSON.stringify(totalTradingAccountBalance));

     
      return {
        totalCount: totalCount,
        totalTradingAccountBalance: totalTradingAccountBalance[0].total,
        applications: result,
      };
    } else {
      return null;
    }

  } catch (e) {
    console.log('getAllAgentsForAILabs error: ' + e);
    return null;
  }

}








// getMyReferAgents
export async function getMyReferAgents(
  {
    page,
    limit,
    agentBot,
    agentBotNumber,
  }
  :
  {
    page: number,
    limit: number,
    agentBot: string,
    agentBotNumber: string,
  },
 ) {


  if (!agentBot || !agentBotNumber) {
    return null;
  }

  //console.log('getMyReferAgents agentBot: ' + agentBot);
  //console.log('getMyReferAgents agentBotNumber: ' + agentBotNumber);


  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');


  // convert agentBotNumber to Int32
  // order by createdAt desc

  const result = await collection.aggregate([
    {
      $match: {
        agentBot: agentBot,
        //agentBotNumber: agentBotNumber,
        agentBotNumber: parseInt(agentBotNumber),
      }
    },
    {
      $sort: {
        createdAt: -1,
      }
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
   
  ]).toArray();


  ////console.log('getMyReferAgents result: ' + JSON.stringify(result));



  if (result) {
    return {
      totalCount: result.length,
      applications: result,
    };
  } else {
    return null;
  }

}





// getOneByWalletAddress
export async function getOneByWalletAddress(walletAddress: string) {

  console.log('getOneByWalletAddress walletAddress: ' + walletAddress);

  if (!walletAddress) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');

  const result = await collection.findOne({ walletAddress: walletAddress });

  if (result) {
    return {
      id: result.id,
      walletAddress: result.walletAddress,
      agentBot: result.agentBot,
      agentBotNumber: result.agentBotNumber,
      userName: result.userName,
      userPhoneNumber: result.userPhoneNumber,
      userEmail: result.userEmail,
      
      okxUid: result.okxUid,
      accountConfig: result.accountConfig,

      htxUsdtWalletAddress: result.htxUsdtWalletAddress,
      
      apiAccessKey: result.apiAccessKey,
      apiSecretKey: result.apiSecretKey,
      apiPassword: result.apiPassword,

      createdAt: result.createdAt,
      startTrading: result.startTrading,
      masterBotInfo: result.masterBotInfo,
      assetValuation: result.assetValuation,
    };
  } else {
    return null;
  }

}


// update agent asset valuation
export async function updateAssetValuation(
  {
    applicationId,
    assetValuation,
  }
  :
  {
    applicationId: number,
    assetValuation: object,
  },
) {

  
  //console.log('updateAssetValuation applicationId: ' + applicationId);
  //console.log('updateAgentAssetValuation assetValuation: ' + assetValuation);

  if (!applicationId || !assetValuation) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');

  const result = await collection.updateOne(
    { id: applicationId },
    {
      $set: {
        assetValuation: assetValuation,
      }
    }
  );

  if (result) {
    return {
      applicationId: applicationId,
      assetValuation: assetValuation,
    };
  } else {
    return null;
  }

}






// update agent account config
export async function updateAccountConfig(
  {
    applicationId,
    accountConfig,
  }
  :
  {
    applicationId: number,
    accountConfig: object,
  },
) {

  if (!applicationId || !accountConfig) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');

  const result = await collection.updateOne(
    { id: applicationId },
    {
      $set: {
        accountConfig: accountConfig,
      }
    }
  );

  if (result) {
    return {
      applicationId: applicationId,
      accountConfig: accountConfig,
    };
  } else {
    return null;
  }

}




// update agent asset balance
export async function updateAssetBalance(
  {
    applicationId,
    assetBalance,
  }
  :
  {
    applicationId: number,
    assetBalance: object,
  },

) {
  

  if (!applicationId || !assetBalance) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');

  const result = await collection.updateOne(
    { id: applicationId },
    {
      $set: {
        assetBalance: assetBalance,
      }
    }
  );

  if (result) {
    return {
      applicationId: applicationId,
      assetBalance: assetBalance,
    };
  } else {
    return null;
  }

}



// update agent trading account balance
export async function updateTradingAccountBalance(
  {
    applicationId,
    tradingAccountBalance,
  }
  :
  {
    applicationId: number,
    tradingAccountBalance: object,
  },
) {

  

  if (!applicationId || !tradingAccountBalance) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');

  const result = await collection.updateOne(
    { id: applicationId },
    {
      $set: {
        tradingAccountBalance: tradingAccountBalance,
      }
    }
  );

  if (result) {
    return {
      applicationId: applicationId,
      tradingAccountBalance: tradingAccountBalance,
    };
  } else {
    return null;
  }

}









// updatePositionList
export async function updatePositionList(
  {
    applicationId,
    positions,
    status,
  }
  :
  {
    applicationId: number,
    positions: object,
    status: boolean,
  },
) {

  if (!applicationId || !positions) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');

  const result = await collection.updateOne(
    { id: applicationId },
    {
      $set: {
        positionList: {
          positions: positions,
          status: status,
          timestamp: new Date().toISOString(),
        
        }
      }
    }
  );

  if (result) {
    return {
      applicationId: applicationId,
      positionList: {
        positions: positions,
        timestamp: new Date().toISOString(),
      }
    };
  } else {
    return null;
  }

}






// update agent bot nft
export async function updateAgentBotNft(
  {
    applicationId,
    agentBotNft,
  }
  :
  {
    applicationId: number,
    agentBotNft: object,
  },
) {


  if (!applicationId || !agentBotNft) {
    return null;
  }



  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');

  const result = await collection.updateOne(
    { id: applicationId },
    {
      $set: {
        agentBotNft: agentBotNft,
      }
    }
  );

  if (result) {
    return {
      applicationId: applicationId,
      agentBotNft: agentBotNft,
    };
  } else {
    return null;
  }

}


// update htxUid
export async function updateHtxUid(
  {
    applicationId,
    htxUid,
  }
  :
  {
    applicationId: number,
    htxUid: number,
  },
) {

  if (!applicationId || !htxUid) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');

  const result = await collection.updateOne(
    { id: applicationId },
    {
      $set: {
        htxUid: htxUid,
      }
    }
  );

  if (result) {
    return {
      applicationId: applicationId,
      htxUid: htxUid,
    };
  } else {
    return null;
  }

}




// update htxUid
export async function updateOkxUid(
  {
    applicationId,
    okxUid,
  }
  :
  {
    applicationId: number,
    okxUid: string,
  },
) {

  if (!applicationId) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');

  const result = await collection.updateOne(
    { id: applicationId },
    {
      $set: {
        okxUid: okxUid,
      }
    }
  );

  if (result) {
    return {
      applicationId: applicationId,
      okxUid: okxUid,
    };
  } else {
    return null;
  }

}



// updateApplicationStartTrading
export async function updateApplicationStartTrading(
  {
    applicationId,
    walletAddress,
  }
  :
  {
    applicationId: number,
    walletAddress: string,
  },
) {

  if (!applicationId) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');

  const result = await collection.updateOne(
    { id: applicationId },
    {
      $set: {
        startTrading: {
          status: true,
          timestamp: new Date().toISOString(),
          approvedByWalletAddress: walletAddress,
          
        }
      }
    }
  );

  if (result) {
    return {
      applicationId: applicationId,
      startTrading: true,
    };
  } else {
    return null;
  }

}












// updateApplicationMasterBotNFT
export async function updateApplicationMasterBotInfo(
  {
    applicationId,
    masterBotInfo,
  }
  :
  {
    applicationId: number,
    masterBotInfo: object,
  },
) {

  if (!applicationId || !masterBotInfo) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');

  const result = await collection.updateOne(
    { id: applicationId },
    {
      $set: {
        masterBotInfo: masterBotInfo,
      }
    }
  );

  if (result) {
    return {
      applicationId: applicationId,
      masterBotInfo: masterBotInfo,
    };
  } else {
    return null;
  }

}

