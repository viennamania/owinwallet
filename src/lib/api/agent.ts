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

  console.log('insertOne data: ' + JSON.stringify(data));
  /*
    {"center":"",
    "walletAddress":"0x2C91bf7ac8300913367Bf1c29b14c25556c0df92",
    "agentBot":"0x1ADf35501D4Edde233C2e1D8b209417dEa4dDd8c",
    "agentBotNumber":0,
    "userName":"judgement",
    "userPhoneNumber":"1234",
    "userEmail":"genie1647@gmail.com",
    "htxUserId":64102420,
    "htxUsdtWalletAddress":"",
    "apiAccessKey":"dc81de74-43e7185b-qz5c4v5b6n-d98b6",
    "apiSecretKey":"f0c5be2c-b5f99118-7c4c1691-6f594"
    }
  */

  if (!data.walletAddress
    || !data.agentBot
    /////|| !data.agentBotNumber  => if agentBotNumber is 0, it will be false
    || !data.userName
    || !data.userEmail
    || !data.htxUserId
    
    //////|| !data.htxUsdtWalletAddress

    || !data.apiAccessKey
    || !data.apiSecretKey) {
    return null;
  }





  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');


  try {

  // check if walletAddress exists
  const checkWalletAddress = await collection.findOne({ walletAddress: data.walletAddress });
  
  ////console.log('checkWalletAddress: ' + JSON.stringify(checkWalletAddress));

  
  if (checkWalletAddress) {
    return null;
  }

  



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
      htxUserId: data.htxUserId,
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
      htxUserId: data.htxUserId,
      htxUsdtWalletAddress: data.htxUsdtWalletAddress,
      apiAccessKey: data.apiAccessKey,
      apiSecretKey: data.apiSecretKey,

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
    const result = await collection.aggregate([
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
      return {
        totalCount: result.length,
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
      htxUid: result.htxUid,
      htxUsdtWalletAddress: result.htxUsdtWalletAddress,
      apiAccessKey: result.apiAccessKey,
      apiSecretKey: result.apiSecretKey,
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

