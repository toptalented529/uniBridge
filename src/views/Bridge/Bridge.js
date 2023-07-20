import React, { useEffect, useMemo, useState } from 'react';
import { usePrevious } from 'hooks';
import { makeStyles, useTheme } from '@mui/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import styles from './styles';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Select,
  Modal,
  TextField,
  Typography,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
} from '@mui/material';
import Image from 'next/image';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

import { assets, networkParams, SCALLOP_CHAINID } from 'constants.js';
import {
  approve,
  getKycCredentials,
  deposit,
  depositScallop,
} from 'crypto/index';
import { toHex } from 'crypto/utils';
import mypic from '../../picture/design.png';
import { switchNetwork } from '../../features/switch/switchSlice.js';
import { useSelector, useDispatch } from 'react-redux';
import { notification } from 'antd';

const Bridge = () => {
  // config theme

  const currentNetwork = useSelector((state) => state.switchs.value);
  console.log('VVVVVVVVVVVV', currentNetwork);
  const theme = useTheme();
  const useStyles = useMemo(() => {
    return makeStyles(styles, { defaultTheme: theme });
  }, [theme]);

  const useStyle = makeStyles((theme) => ({
    root: {
      color: theme.palette.primary.main,
    },
    links: {
      padding: '1vw',
      background: '#f2f2f2',
      // color: 'white',
      borderColor: 'gray',
      borderWidth: '1px',
      width: '34vw',
      // height:"6vw",
      borderRadius: '1vw',
      marginTop: '1vw',
      outline: '30px',
      '&:hover': {
        textDecorationColor: 'black',
      },
    },
    input: {
      padding: '1vw',
      background: 'transparent',
      color: 'grey',
      fontSize: '25px',
      borderWidth: '1px',
      width: '100%',
      minWidth: '20px',
      marginTop: '1vw',
      outline: '30px',
      borderRadius: '15px',
      borderColor: 'grey',
      'text-align': 'center',

      '&::hover': {
        textDecorationColor: 'red',
        borderWidth: '0px',
        border: 'none',
      },
      '&::active': {
        borderWidth: '0px',
      },
      '&::placeholder': {
        color: 'grey',
        'text-align': 'center',
      },
    },
    MenuItems: {
      borderRadius: '20px',
      color: 'black',
      borderWidth: '20px',
      outline: '30px',
    },
    button: {
      width: '100%',
      borderRadius: '20px',
      backgroundColor: 'rgb(51, 102, 255)',
    },
  }));
  const classes = useStyle();

  // config modal

  // config bridge params
  const [asset, setAsset] = useState(assets[0]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState(null);

  const handleOpen = () => setOpens(true);
  const handleClose = () => setOpens(false);

  // config wallet connect
  const [web3Modal, setWeb3Modal] = useState({});
  const [provider, setProvider] = useState();
  const [library, setLibrary] = useState();
  const [account, setAccount] = useState();
  const [error, setError] = useState('');
  const [chainId, setChainId] = useState();
  const [ids, setIds] = useState(0);
  const [amount, setAmount] = useState('');
  const [fromChain, setFromChain] = useState(5);
  const [toChain, setToChain] = useState(1340);
  const [isApproved, setApproved] = useState(false);
  const [opens, setOpens] = useState(false);
  const prevChains = usePrevious({ fromChain, toChain });

  const providerOptions = {};

  useEffect(() => {
    if (currentNetwork === 5) {
      setIds(1);
      setAsset(assets[1]);
      if (fromChain === SCALLOP_CHAINID) {
        setToChain(currentNetwork);
      } else {
        setToChain(SCALLOP_CHAINID);
        setFromChain(currentNetwork);
      }
    }

    if (currentNetwork === 97) {
      setIds(2);
      setAsset(assets[2]);
      if (fromChain === SCALLOP_CHAINID) {
        setToChain(currentNetwork);
      } else {
        setFromChain(currentNetwork);
        setToChain(SCALLOP_CHAINID);
      }

      setApproved(false);
    }
  }, [currentNetwork]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const web3modal = new Web3Modal({
        network: 'mainnet', // optional
        cacheProvider: true, // optional
        providerOptions, // required
      });
      setWeb3Modal(web3modal);
    }
  }, []);

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();
      setProvider(provider);
      setLibrary(library);
      if (accounts) setAccount(accounts[0]);
      setChainId(network.chainId);
    } catch (error) {
      setError(error);
    }
  };

  const handleAmount = (e) => {
    const amount = e.target.value;
    if (!amount || amount.match(/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/)) {
      setAmount(amount);
    }
  };

  const handleFirstName = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastName = (e) => {
    setLastName(e.target.value);
  };

  const handleBirthday = (newValue) => {
    setBirthday(newValue);
  };

  const handleFromChain = (e) => {
    const id = e.target.value;
    setFromChain(id);
    setApproved(false);
  };

  const handleToChain = (e) => {
    const id = e.target.value;
    console.log('here', id);
    setToChain(id);
    setApproved(false);
  };

  const switchNetwork = async (chainId) => {
    try {
      await library.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: toHex(chainId) }],
      });
    } catch (switchError) {
      console.log(switchError);
      if (switchError.code === 4902) {
        const orgParams = networkParams[toHex(chainId)];
        console.log(orgParams.hexChainId);
        const params = {
          chainId: `0x${Number(orgParams.chainId).toString(16)}`,
          rpcUrls: [...orgParams.rpcUrls],
          chainName: orgParams.chainName,
          nativeCurrency: orgParams.nativeCurrency,
          blockExplorerUrls: orgParams.blockExplorerUrls,
          iconUrls: orgParams.iconUrls,
        };
        try {
          // await library.provider.request({
          //   method: 'wallet_addEthereumChain',
          //   params: [params],
          // });
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [params],
          });
          console.log('over');
        } catch (error) {
          setError(error);
        }
      }
    }
  };

  const refreshState = () => {
    setAccount();
    setChainId();
    setFromChain(SCALLOP_CHAINID);
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
  };

  // useEffect(() => {
  //   if (web3Modal.cachedProvider) {
  //     connectWallet();
  //   }
  // }, []);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        console.log('accountsChanged', accounts);
        if (accounts) setAccount(accounts[0]);
      };

      const handleChainChanged = (_hexChainId) => {
        console.log('chainChanged', _hexChainId);
        setChainId(parseInt(_hexChainId, 16));
      };

      const handleDisconnect = () => {
        console.log('disconnect', error);
        disconnect();
      };

      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', handleChainChanged);
      provider.on('disconnect', handleDisconnect);
      provider.on('connect', (info) => {
        console.log('connect', info);
      });

      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
          provider.removeListener('chainChanged', handleChainChanged);
          provider.removeListener('disconnect', handleDisconnect);
        }
      };
    }
  }, [provider]);

  useEffect(() => {
    if (fromChain === toChain) {
      setToChain(prevChains.fromChain);
    }
  }, [fromChain]);

  useEffect(() => {
    if (fromChain === toChain) {
      setFromChain(prevChains.toChain);
    }
  }, [toChain]);

  const handleApprove = async () => {
    if (chainId !== fromChain) {
      await switchNetwork(fromChain);
      return;
    }
    const signer = library.getSigner();
    let ethBalanceHex = await signer.getBalance();
    let ethBalance = ethers.utils.formatEther(ethBalanceHex, 'ether');
    console.log(ethBalance);

    if (!amount) {
      // window.alert('Please input token amount to transfer!');
      notification.error({
        message: 'Deposit',
        description: 'Please input token amount to transfer!',
      });
      return;
    }

    if (ethBalance === 0) {
      // window.alert('You don\'t have enough ether!');
      notification.error({
        message: 'Deposit',
        description: "You don't have enough ether!",
      });
      return;
    }
    console.log('88888888888', asset.address[toHex(chainId)]);

    const res = await approve(
      amount,
      asset.address[toHex(chainId)],
      currentNetwork,
      chainId,
      signer,
    );
    if (res === 1) {
      notification.success({
        message: 'Approve',
        description: `Successfully approved ${amount} ${asset.symbol}`,
      });
      setApproved(true);
    } else {
      notification.error({
        message: 'Approve',
        description: 'Approved failed',
      });
      setApproved(false);
    }
  };

  const handleAddCredentials = async () => {
    if (!amount) {
      // window.alert('Please input token amount to transfer!');
      notification.info({
        message: 'Deposit',
        description: 'Please input token amount to transfer!',
      });
      return;
    }

    handleOpen();
  };

  const handleDeposit = async () => {
    if (chainId !== fromChain) {
      await switchNetwork(fromChain);
      return;
    }
    const signer = library.getSigner();
    let ethBalanceHex = await signer.getBalance();
    let ethBalance = ethers.utils.formatEther(ethBalanceHex, 'ether');
    console.log(ethBalance);

    if (!amount) {
      // window.alert('Please input token amount to transfer!');
      notification.info({
        message: 'Deposit',
        description: 'Please input token amount to transfer!',
      });
      return;
    }

    if (ethBalance === 0) {
      // window.alert('You don\'t have enough ether!');
      notification.error({
        message: 'Deposit',
        description: "You don't have enough ether!",
      });
      return;
    }

    if (fromChain !== SCALLOP_CHAINID) {
      const res = await deposit(
        amount,
        networkParams[toHex(toChain)].id,
        asset.resourceId,
        currentNetwork,
        fromChain,
        signer,
      );
      setApproved(false);
      setAmount(0);
      handleOpen();
    } else {
      const res = await depositScallop(
        amount,
        networkParams[toHex(toChain)].id,
        asset.resourceId,
        currentNetwork,
        fromChain,
        signer,
      );
      setApproved(false);
      setAmount(0);
      handleOpen();
    }
  };

  return (
    <Container maxWidth="lg" style={{ backgroundColor: '#F4F4F4!important' }}>
      <Box as="main" className={classes.main}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item>
            <Paper
              sx={{
                maxWidth: 650,
                width: '90%',

                borderRadius: '20px',
                backgroundColor: '#fff',
              }}
            >
              <Box
                component="div"
                sx={{
                  display: 'flex',
                  'flex-direction': 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  component="div"
                  sx={{
                    paddingLeft: '15px',
                    paddingTop: '25px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box
                    component="div"
                    sx={{ display: 'flex', flexDirection: 'row' }}
                  >
                    <Box
                      component="div"
                      sx={{
                        width: '16px!important',
                        height: '32px!important',
                        backgroundColor: '#B5E4CA!important',
                        borderRadius: '5px',
                      }}
                    ></Box>
                    <Typography
                      sx={{
                        fontWeight: '900',
                        fontSize: '20px',
                        paddingLeft: '5px',
                        paddingBottom: '15px',
                      }}
                    >
                      Bridge Tokens
                    </Typography>
                  </Box>
                  <Typography>
                    Bridge over UniverseBridge for Ethereum, BSC
                  </Typography>
                </Box>
                <Image
                  sx={{
                    width: '100px!important',
                    height: '200.58px!important',
                  }}
                  alt="s"
                  src={mypic}
                />
              </Box>

              <Box
                m="40px"
                sx={{
                  marginTop: '0',
                  backgroundColor: '#F4F4F4',
                  padding: '20px 10px 10px 10px',
                  borderRadius: '15px',
                }}
              >
                <Box
                  m="40px"
                  sx={{
                    marginTop: '0',
                    backgroundColor: '#fff',
                    padding: '20px 20px 20px 20px',
                    borderRadius: '15px',
                  }}
                >
                  <div>
                    {' '}
                    <Dialog open={opens} onClose={handleClose}>
                      <DialogTitle>Bridge started</DialogTitle>
                      <DialogContent>
                        <p>It will take some minute to be completed.</p>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>Close</Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={`0 ${asset.symbol}`}
                    value={amount}
                    onChange={handleAmount}
                    className={classes.input}
                    style={{ borderRadius: '15px!important' }}
                  />
                  <Select
                    value={asset.bridgeID}
                    renderValue={(value) => (
                      <Box display="flex" alignItems="center">
                        <Box pl="10px" width="34%">
                          <Typography variant="caption">Move</Typography>
                        </Box>
                        <Box>
                          <Typography>
                            {
                              assets.find((assett) => assett.bridgeID === value)
                                .symbol
                            }
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    sx={{
                      my: '10px',
                      width: '100%',
                      borderRadius: '20px',
                    }}
                  >
                    {assets
                      .filter(({ bridgeID }) => bridgeID === asset.bridgeID)
                      .map((asset) => (
                        <MenuItem
                          key={asset.resourceId}
                          value={asset.resourceId}
                        >{`${asset.name} (${asset.symbol})`}</MenuItem>
                      ))}
                  </Select>
                  <Select
                    value={fromChain}
                    renderValue={(value) => (
                      <Box display="flex" alignItems="center">
                        <Box pl="10px" width="34%">
                          <Typography variant="caption">From</Typography>
                        </Box>
                        <Box>
                          <Typography>
                            {networkParams[toHex(value)].chainName}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    sx={{
                      my: '10px',
                      width: '100%',
                      borderRadius: '20px',
                    }}
                    onChange={handleFromChain}
                  >
                    {Object.values(networkParams)
                      .filter((network) => {
                        if (
                          network.chainId === fromChain ||
                          network.chainId === toChain
                        )
                          return true;
                      })
                      .map((network) => (
                        <MenuItem key={network.chainId} value={network.chainId}>
                          {network.chainName}
                        </MenuItem>
                      ))}
                  </Select>
                  <Select
                    value={toChain}
                    renderValue={(value) => (
                      <Box display="flex" alignItems="center">
                        <Box pl="10px" width="34%">
                          <Typography variant="caption">To</Typography>
                        </Box>
                        <Box>
                          <Typography>
                            {networkParams[toHex(value)].chainName}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    sx={{
                      my: '10px',
                      width: '100%',
                      borderRadius: '20px',
                    }}
                    onChange={handleToChain}
                  >
                    {Object.values(networkParams)
                      .filter((network) => {
                        if (
                          network.chainId === fromChain ||
                          network.chainId === toChain
                        )
                          return true;
                      })
                      .map((network) => (
                        <MenuItem key={network.chainId} value={network.chainId}>
                          {network.chainName}
                        </MenuItem>
                      ))}
                  </Select>
                </Box>
              </Box>
              <Divider />
              <Box p="40px">
                {chainId ? (
                  isApproved ? (
                    <Button
                      variant="contained"
                      sx={{
                        width: '100%',
                        borderRadius: '20px',
                      }}
                      onClick={() => handleDeposit()}
                    >
                      Deposit
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{
                        width: '100%',
                        borderRadius: '20px',
                      }}
                      onClick={() => handleApprove()}
                    >
                      Approve
                    </Button>
                  )
                ) : (
                  <Button
                    variant="contained"
                    sx={{
                      width: '100%',
                      borderRadius: '20px',
                    }}
                    onClick={() => connectWallet()}
                  >
                    Connect Wallet
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Bridge;
