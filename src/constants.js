export const assets = [
  {
    address: {
      '0x53c': '0x175892D305DDd171d71f26A0bCfA327B56f75F4f',
      '0x13881': '0x175892D305DDd171d71f26A0bCfA327B56f75F4f',
    },
    name: 'WMATIC',
    symbol: 'Wmatic',
    resourceId: '0x000000000000000000000000000000c76ebe4a02bbc34786d860b355f5a5ce02',
    bridgeID: 0
  },
  {
    address: {
      '0x53c': '0x4dE713e8B30c3c39BcdA404476F64553e6161EBf',
      '0x5': '0xe118E7D04FEC8CE235ea9C5Bb1C2059833B06E6C',
    },
    name: 'USDT',
    symbol: 'USDT',
    resourceId: '0x000000000000000000000000000000c76ebe4a02bbc34786d860b355f5a5ce00',
    bridgeID: 1
  },
  {
    address: {
      '0x53c': '0x178aeE8f271042dE73EB80709535EF3c02E3F67F',
      '0x61': '0x175892D305DDd171d71f26A0bCfA327B56f75F4f',
    },
    name: 'DAI',
    symbol: 'DAI',
    resourceId: '0x000000000000000000000000000000c76ebe4a02bbc34786d860b355f5a5ce01',
    bridgeID: 2
  },
]; 

export const networkParams = {
  '0x53c': {
    id: 1,
    chainId: 1340,
    hexChainId: '0x53c',
    rpcUrls: ['http://193.203.15.109:8545/'],
    chainName: 'Universe Testnet',
    nativeCurrency: { name: 'Une', decimals: 18, symbol: 'Une' },
    blockExplorerUrls: ['http://52.56.60.20:4000/', 'https://52.56.60.20:4000'],
    iconUrls: [],
    gasPrice: '10000000000',
    gasLimit: '1000000'
  },
  '0x13881': {
    id: 1,
    chainId: 80001,
    hexChainId: '0x13881',
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    chainName: 'Mumbai Testnet',
    nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
    blockExplorerUrl: ['https://mumbai.polygonscan.com/'],
    iconUrls: [],
    gasPrice: '30000000000',
    gasLimit: '8000000'
  },

  '0x5': {
    id: 0,
    chainId: 5,
    hexChainId: '0x5',
    // rpcUrls: ['https://ethereum-goerli-rpc.allthatnode.com'],
    rpcUrls: ['https://endpoints.omniatech.io/v1/eth/goerli/public'],
    chainName: 'Ethereum Testnet',
    nativeCurrency: { name: 'Ether', decimals: 18, symbol: 'Ether' },
    blockExplorerUrl: ['https://goerli.etherscan.io'],
    iconUrls: [],
    gasPrice: '30000000000',
    gasLimit: '8000000'
  },
  '0x61': {
    id: 0,
    chainId: 97,
    hexChainId: '0x61',
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    chainName: 'BNB Testnet',
    nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'Bnb' },
    blockExplorerUrl: ['https://goerli.etherscan.io'],
    iconUrls: [],
    gasPrice: '30000000000',
    gasLimit: '8000000'
  },
};

export const bridgeParams = {
  "0x61": {
    '0x53c': {
      bridge: '0x39E15acB2D2DB892De0cD6de26a0F99bAc8B5557',
      handler: '0xa7ebda2C93A198bc1BebFBb2735AF62885732de6'
    },
    '0x61': {
      bridge: '0x6868dFde00714aDA90abE073Bd2cB992a06F50FD',
      handler: '0xC3b38E20BEeE2c791c98958e6D06856F42bA1f4c',
      kycOracle: '0x45857A2887500518921fdA96FA8A0E16737345bF'
    }
  },
  "0x13881": {
    '0x53c': {
      bridge: '0xAE131c6d3A4FE33D89bf1f2F0beD651c48088628',
      handler: '0xc58Fa8DF06789873128A84B168b7D065eb4deDFd'
    },
    '0x13881': {
      bridge: '0x566427a195ceB38eB045a8cA66051624a699079A',
      handler: '0x05a2730C9E9F5828c4ED1D830744010393c79C7e',
      kycOracle: '0x934f28AC9a132CEcf95B49830074Cdf360264171'
    }
  },
  "0x5": {
    '0x53c': {
      bridge: '0x8e5CAa26727CFd0d6dCD3373B2Da157352ea7f77',
      handler: '0x71584b8Ec2Dda1b45889196b434529b95A0819E5'
    },
    '0x5': {
      bridge: '0x190DD1cBa31343Fc52A55b294fBf69BDA9211823',
      handler: '0xDDC7771176D9491854d28302993E429D01D849AC',
      kycOracle: '0x934f28AC9a132CEcf95B49830074Cdf360264171'
    }
  }
};

export const SCALLOP_CHAINID = 1340;

export const backendUrl = 'https://scallopbridge-backend.herokuapp.com';