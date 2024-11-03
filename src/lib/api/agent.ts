import clientPromise from '../mongodb';


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
  {"walletAddress":"0x7bfF3359841D26C8046364b93E7dA01886ae1c22",
  "agentBot":"0xf1963dB42E46b5EFf302c0fD9AC42AEaEd0C39A8",
  "userName":"dsaf",
  "userPhoneNumber":"23423",
  "userEmail":"sadfs",
  "htxUid":"sdaf",
  "htxUsdtWalletAddress":"sdf",
  "apiAccessKey":"sadf",
  "apiSecretKey":"sdfasd"}
  */

  if (!data.walletAddress
    || !data.agentBot
    || !data.userName
    || !data.userPhoneNumber
    || !data.userEmail
    || !data.htxUid
    || !data.htxUsdtWalletAddress
    || !data.apiAccessKey
    || !data.apiSecretKey) {
    return null;
  }


  const client = await clientPromise;
  const collection = client.db('vienna').collection('agents');


  // check if walletAddress exists
  const checkWalletAddress = await collection.findOne({ walletAddress: data.walletAddress });
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
      userName: data.userName,
      userPhoneNumber: data.userPhoneNumber,
      userEmail: data.userEmail,
      htxUid: data.htxUid,
      htxUsdtWalletAddress: data.htxUsdtWalletAddress,
      apiAccessKey: data.apiAccessKey,
      apiSecretKey: data.apiSecretKey,

      createdAt: new Date().toISOString(),
    }
  );

  if (result) {
    return {
      id: id,
      walletAddress: data.walletAddress,
      agentBot: data.agentBot,
      userName: data.userName,
      userPhoneNumber: data.userPhoneNumber,
      userEmail: data.userEmail,
      htxUid: data.htxUid,
      htxUsdtWalletAddress: data.htxUsdtWalletAddress,
      apiAccessKey: data.apiAccessKey,
      apiSecretKey: data.apiSecretKey,
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
      userName: result.userName,
      userPhoneNumber: result.userPhoneNumber,
      userEmail: result.userEmail,
      htxUid: result.htxUid,
      htxUsdtWalletAddress: result.htxUsdtWalletAddress,
      apiAccessKey: result.apiAccessKey,
      apiSecretKey: result.apiSecretKey,
    };
  } else {
    return null;
  }

}