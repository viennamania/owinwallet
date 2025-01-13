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




import { Network, Alchemy } from 'alchemy-sdk';




const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);







export async function insertOne(data: any) {

  //console.log('insertOne data: ' + JSON.stringify(data));
  



  if (!data.walletAddress
    
    ///|| !data.agentBot
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



    const totalTradingAccountBalance = await collection.aggregate([
      {
        $match: {
          marketingCenter: marketingCenter,
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: "$tradingAccountBalance.balance" } },
        }
      }
    ]).toArray();



    if (result) {
      return {
        totalCount: result.length,
        totalTradingAccountBalance: totalTradingAccountBalance[0].total,
        applications: result,
      };
    } else {
      return null;
    }

  }
  
}



// get All Applications for Center
// sort by createdAt desc
export async function getAllApplicationsForCenter({
  center = '',
  page = 1,
  limit = 200,
}) {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');

  const result = await collection.find(
    {
      center: center,
    },
    {
      sort: { createdAt: -1 },
      skip: (page - 1) * limit,
      limit: limit,
    },
  ).toArray();

  const totalTradingAccountBalance = await collection.aggregate([
    {
      $match: {
        center: center,
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: { $toDouble: "$tradingAccountBalance.balance" } },
      }
    }
  ]).toArray();
  

  if (result) {
    return {
      totalCount: result.length,
      totalTradingAccountBalance: totalTradingAccountBalance[0].total,
      applications: result,
    };
  } else {
    return null;
  }

}





// get summary of Applications for Center
// group by agentBot, agentBotNumber
export async function getSummaryApplicationsForCenter({
  center = '',
}) {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');

  const result = await collection.aggregate([
    {
      $match: {
        center: center,

        $and: [
          { "accountConfig.data.roleType": "2" },
          { "accountConfig.data.roleType": { $exists: true } },
        ]
      }
    },
    {
      $group: {
        _id: { agentBot: "$agentBot", agentBotNumber: "$agentBotNumber" },
        tradingAccountBalanceCount: { $sum: 1 },
        tradingAccountBalanceSum: { $sum: { $toDouble: "$tradingAccountBalance.balance" } },
      }
    }
  ]).toArray();

  ///console.log('getSummaryApplicationsForCenter result: ' + JSON.stringify(result));

  if (result) {
    return {
      result: result,
    };
  } else {
    return null;
  }

}




// get count, and sum of tradingAccountBalance.balance
// group by center
// order by center asc
// where accountConfig.data.roleType = "2"
export async function getAgentCenterSummary(
  {
    marketingCenter,
  }
  :
  {
    marketingCenter: string,
  },
) {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');

  const result = await collection.aggregate([
    {
      $match: {
        marketingCenter: marketingCenter,
        
        $and: [
          { "accountConfig.data.roleType": "2" },
          { "accountConfig.data.roleType": { $exists: true } },
        ]
      }
    },
    {
      $group: {
        _id: "$center",
        tradingAccountBalanceCount: { $sum: 1 },
        tradingAccountBalanceSum: { $sum: { $toDouble: "$tradingAccountBalance.balance" } },
      }
    },
    {
      $sort: {
        _id: 1,
      }
    }

  ]).toArray();

  if (result) {
    return {
      result: result,
    };
  } else {
    return null;
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


      // sum of total affliliateInvitee.data.volMonth is string convert to number
      const totalAffiliateInviteeVolMonth = await collection.aggregate([
        {
          $match: {
            ///apiPassword: { $exists: true },
            exchange: 'okx',
            affiliateInvitee: { $exists: true },
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: { $toDouble: "$affiliateInvitee.data.volMonth" } },
          }
        }
      ]).toArray();

      //console.log('totalAffiliateInviteeVolMonth: ' + JSON.stringify(totalAffiliateInviteeVolMonth));


   

     
      return {
        totalCount: totalCount,
        totalTradingAccountBalance: totalTradingAccountBalance[0].total,
        totalAffiliateInviteeVolMonth: totalAffiliateInviteeVolMonth[0].total,
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




// getAllAgents
// sort by createdAt desc
// where tradingAccountBalance.balance > 0
export async function getAllAgentsForLive({ page = 1, limit = 100 }) {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');

  try {


    // check apiPassword is exists

    const result = await collection.aggregate([
      {
        $match: {
          ///apiPassword: { $exists: true },
          exchange: 'okx',
          tradingAccountBalance: { $exists: true },
          $expr: { $gt: [{ $toDouble: "$tradingAccountBalance.balance" }, 0] },
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
          tradingAccountBalance: { $exists: true },
          $expr: { $gt: [{ $toDouble: "$tradingAccountBalance.balance" }, 0] },
        },
      ).count();


      // sum of total trandingAccountBalance.balance is string convert to number

      const totalTradingAccountBalance = await collection.aggregate([
        {
          $match: {
            ///apiPassword: { $exists: true },
            exchange: 'okx',
            tradingAccountBalance: { $exists: true },
            $expr: { $gt: [{ $toDouble: "$tradingAccountBalance.balance" }, 0] },
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


  const totalTradingAccountBalance = await collection.aggregate([
    {
      $match: {
        agentBot: agentBot,
        //agentBotNumber: agentBotNumber,
        agentBotNumber: parseInt(agentBotNumber),
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

  if (result) {
    return {
      totalCount: result.length,
      totalTradingAccountBalance: totalTradingAccountBalance[0].total,
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
      tradingAccountBalance: result.tradingAccountBalance,
      assetBalance: result.assetBalance,



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


// get One By OkxUid
export async function getOneByOkxUid(okxUid: string) {

  //console.log('getOneByOkxUid okxUid: ' + okxUid);

  if (!okxUid) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');

  const result = await collection.findOne({ okxUid: okxUid });

  return result;

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

  if (!result) {
    return null;
  }



  // insert tradingAccountBalance to collection tradingAccountBalanceHistory

  const collectionTradingAccountBalanceHistory = client.db('vienna').collection('tradingAccountBalanceHistory');

  await collectionTradingAccountBalanceHistory.insertOne(
    {
      applicationId: applicationId,
      tradingAccountBalance: tradingAccountBalance,
      timestamp: new Date().toISOString(),
    }
  );







  return {
    applicationId: applicationId,
    tradingAccountBalance: tradingAccountBalance,
  };

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





//getStatisticsDaily
// get statistics daily Trading Balance
// from tradingAccountBalanceHistory
// balance is tradingAccountBalance.balance
//convert  "timestamp": "2025-01-07T09:44:40.065Z" to '20240107'
// group by '20240107'

// join tradingAccountBalance.applicationId with id of agents collection


/*
tradingAccountBalanceHistory
{
  "_id": {
    "$oid": "677cf78837aa8c335b1c40ed"
  },
  "applicationId": 777460,
  "tradingAccountBalance": {
    "balance": "105.71926424278588",
  },
  "timestamp": "2025-01-07T09:44:40.065Z"
}
*/

/* 
agents
{

  "id": 294507,
  "center": "ppump_orry_bot",
}
*/



export async function getStatisticsDaily(
  {
    marketingCenter,
  }
  :
  {
    marketingCenter: string,
  },
) {

  if (!marketingCenter) {
    return null;
  }

  console.log('getStatisticsDaily marketingCenter: ' + marketingCenter);


  try {

    const client = await clientPromise;

    const collection = client.db('vienna').collection('tradingAccountBalanceHistory');

    // join with agents collection (agents.id = tradingAccountBalanceHistory.applicationId)
    // match agents.center = center

    // project id, marketingCenter from agents collection





    const result = await collection.aggregate([
      {
        $lookup: {
          
          //from: "agents",

          from: "agents",

          localField: "applicationId",
          foreignField: "id",
          as: "agent",
        }
      },
    
      {
        $unwind: "$agent"
      },

      {
        $match: {
          "agent.marketingCenter": marketingCenter,
        }
      },

      /* "timestamp": "2025-01-07T09:44:40.065Z" */
      {
        $group: {
          _id: {
            ///yearmonthday: { $dateToString: { format: "%Y%m%d", date: "$timestamp" } },

            //yearmonthday: { $dateToString: { format: "%Y%m%d", date: { $toDate: "$timestamp" } } },

            // conver "2025-01-07T09:44:40.065Z" to '2025-01-07' by substr

            yearmonthday: { $substr: ["$timestamp", 0, 10] },




          },
          // average of tradingAccountBalance.balance
          //total: { $sum: { $toDouble: "$tradingAccountBalance.balance" } },
          
          // average of tradingAccountBalance.balance
          ///total: { $avg: { $toDouble: "$tradingAccountBalance.balance" } },

          // sum of tradingAccountBalance.balance
          // sum / count = average

          total: { $sum: { $toDouble: "$tradingAccountBalance.balance" } },

          // count of tradingAccountBalance.balance

          count: { $sum: 1 },

          // count of distinct applicationId

          ///countDistinct: { $sum: 1 },














        }
      },
      {
        $sort: {
          _id: 1,
        }
      }
    ]).toArray();

    console.log('getStatisticsDaily result: ' + JSON.stringify(result));

    return result;

  } catch (e) {

    console.log('getStatisticsDaily error: ' + e);
    return null;
  }

}













// updateAccountAffiliateInvitee
export async function updateAccountAffiliateInvitee(
  {
    applicationId,
    affiliateInvitee,
  }
  :
  {
    applicationId: number,
    affiliateInvitee: object,
  },
) {

  if (!applicationId || !affiliateInvitee) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');

  // insert affiliateInvitee to collection affiliateInviteeHistory
  const collectionAffiliateInviteeHistory = client.db('vienna').collection('affiliateInviteeHistory');
  await collectionAffiliateInviteeHistory.insertOne(
    {
      applicationId: applicationId,
      affiliateInvitee: affiliateInvitee,
      timestamp: new Date().toISOString(),
    }
  );



  const result = await collection.updateOne(
    { id: applicationId },
    {
      $set: {
        affiliateInvitee: affiliateInvitee,
      }
    }
  );

  if (result) {
    return {
      applicationId: applicationId,
      affiliateInvitee: affiliateInvitee,
    };
  } else {
    return null;
  }

}






// setSettlementClaim
export async function setSettlementClaim(
  {
    applicationId,
  }
  :
  {
    applicationId: number,
  },
) {

  if (!applicationId) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');

  // insert settlementClaim to collection settlementClaimHistory

  const application = await collection.findOne({ id: applicationId });

  if (!application) {
    return null;
  }


  const okxUid = application.okxUid;
  const tradingAccountBalance = application.tradingAccountBalance;


  const claimedTradingVolume = application?.claimedTradingVolume || 0;

  const tradingVolume = application.affiliateInvitee?.data?.volMonth || 0;

  if (tradingVolume <= (claimedTradingVolume + 1000)) {
    return null;
  }



  const settlementTradingVolume = tradingVolume - claimedTradingVolume;

  const tradingFee = settlementTradingVolume * 0.000455;
  const insentive = Number(tradingFee * 0.23).toFixed(8);

  const masterInsentive = Number(tradingFee * 0.23 * 0.56).toFixed(8);
  const masterWalletAddress = application.walletAddress;



  const agentInsentive = Number(tradingFee * 0.23 * 0.28).toFixed(8);

  // get agentWalletAddress from agentBot and agentBotNumber
  //     const response = await alchemy.nft.getOwnersForNft(address, tokenId)

  const nftContractAddress = application.agentBot;
  const tokenId = application.agentBotNumber;

  const response = await alchemy.nft.getOwnersForNft(nftContractAddress, tokenId);
  /* { owners: [ '0xf5fff32cf83a1a614e15f25ce55b0c0a6b5f8f2c' ] } */

  const agentWalletAddress = response?.owners[0] || "";


  if (!agentWalletAddress) {
    return null;
  }




  const centerInsentive = Number(tradingFee * 0.23 * 0.14).toFixed(8);
  
  //const centerWalletAddress = "";
  // api call to get centerWalletAddress
  // POST https://https://shinemywinter.vercel.app/api/user/getCenterOwnerByCenter
  // { center: center }

  const center = application.center;

  const getCenterOwnerByCenter = await fetch(`https://shinemywinter.vercel.app/api/user/getCenterOwnerByCenter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      center: center,
    }),
  })

  const centerOwner = await getCenterOwnerByCenter.json();

  ///console.log('centerOwner: ' + JSON.stringify(centerOwner));

  const centerWalletAddress = centerOwner?.result?.walletAddress || "";


  if (!centerWalletAddress) {
    return null;
  }


  // send USDT to masterWalletAddress, agentWalletAddress, centerWalletAddress







  const settlementClaim = {
    okxUid: okxUid,
    tradingAccountBalance: tradingAccountBalance,
    tradingVolume: tradingVolume,
    settlementTradingVolume: settlementTradingVolume,
    tradingFee: tradingFee,
    insentive: insentive,
    masterInsentive: masterInsentive,
    masterWalletAddress: masterWalletAddress,
    agentInsentive: agentInsentive,
    agentWalletAddress: agentWalletAddress,
    centerInsentive: centerInsentive,
    centerWalletAddress: centerWalletAddress,
  };





  const collectionSettlementClaimHistory = client.db('vienna').collection('settlementClaimHistory');
  const result = await collectionSettlementClaimHistory.insertOne(
    {
      applicationId: applicationId,
      timestamp: new Date().toISOString(),
      settlementClaim: settlementClaim,
    }
  );

  // update climedTradingVolume in agents collection
  // climedTradingVolume = climedTradingVolume + settlementTradingVolume
  // if claimedTradingVolume is empty, climedTradingVolume = settlementTradingVolume

  const resultUpdate = await collection.updateOne(
    { id: applicationId },
    {
      $set: {
        claimedTradingVolume: claimedTradingVolume + settlementTradingVolume,
      }
    }
  );



  if (result) {
    return {
      applicationId: applicationId,
      settlementClaim: settlementClaim,
    };
  }


}