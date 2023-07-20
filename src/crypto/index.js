import { ethers } from 'ethers';
import axios from 'axios';
import { networkParams, bridgeParams, backendUrl } from 'constants.js';
import { toHex } from './utils';
import tokenAbi from './abis/ERC20.json';
import bridgeAbi from './abis/Bridge.json';
import bridgeScallopAbi from './abis/BridgeScallop.json';
import { useSelector, useDispatch } from 'react-redux';
import {notification} from "antd"




export const approve = async (amount, tokenAddr,currentNetwork, chainId, wallet) => {



  const token = new ethers.Contract(tokenAddr, tokenAbi, wallet);
  const handlerAddr = bridgeParams[toHex(currentNetwork)][toHex(chainId)].handler;

  let amountInWei = ethers.utils.parseUnits(amount.toString(), 'ether');
  let gasPrice = ethers.utils.hexlify(
    Number(networkParams[toHex(chainId)].gasPrice),
  );
  let gasLimit = ethers.utils.hexlify(
    Number(networkParams[toHex(chainId)].gasLimit),
  );

  let account = await wallet.getAddress();
  let balanceInWei = await token.balanceOf(account);
  let balance = ethers.utils.formatEther(balanceInWei, 'ether');

  if (balance< amount/1) {
    console.log('You don\'t have enough token balance!',balance<amount/1);
    return;
  }

  const allowanceInWei = await token.allowance(account, handlerAddr);
  let allowance = ethers.utils.formatEther(allowanceInWei, 'ether');

  console.log(allowance)
  if (allowance >= amount) {
    // window.alert('Enough token is already approved!');
    notification.info({
      message: "Approve",
      description:"Enough token is already approved!",
      
    }) 

    return 1;
  }

  const tx = await token.approve(handlerAddr, amountInWei);

  // window.alert(`Transaction submitted!\n Transaction hash: ${tx.hash}`);
  await new Promise((resolve) => {
  notification.info({
    message: "Pending",
    description:`Transaction submitted!\n Transaction hash: ${tx.hash}`,
    onClose: resolve, // Resolve the Promise when the notification is closed
  }) 
})
  const res = await tx.wait();
  return res.status;
};

export const getKycCredentials = async (firstName, lastName, birthday) => {
  try {
    console.log('\nKYC information:');
    console.log(`  firstName: ${firstName}`);
    console.log(`  lastName: ${lastName}`);
    console.log(`  birthday: ${birthday}`);
    console.log('Creating KYC credentials from Bridge backend!');
    const res = await axios({
      url: `${backendUrl}/kyc-encrypt`,
      data: {
        firstName,
        lastName,
        birthday,
      },
      method: 'post',
    });

    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const deposit = async (
  amount,
  dest,
  resourceId,
  currentNetwork,
  chainId,
  wallet,
) => {
  // if (!credentials) {
  //   console.log('\nYou must input credentials!');
  //   return;
  // }

  console.log("ffeerr",chainId)

  const bridgeAddr = bridgeParams[toHex(currentNetwork)][toHex(chainId)].bridge;
  const bridge = new ethers.Contract(bridgeAddr, bridgeAbi.abi, wallet);
  const recipient = await wallet.getAddress();

  let amountInWei = ethers.utils.parseUnits(amount.toString(), 'ether');
  let gasPrice = ethers.utils.hexlify(
    Number(networkParams[toHex(chainId)].gasPrice),
  );
  let gasLimit = ethers.utils.hexlify(
    Number(networkParams[toHex(chainId)].gasLimit),
  );

  const data =
    '0x' +
    ethers.utils.hexZeroPad(amountInWei.toHexString(), 32).substr(2) + // Deposit Amount        (32 bytes)
    ethers.utils
      .hexZeroPad(ethers.utils.hexlify((recipient.length - 2) / 2), 32)
      .substr(2) + // len(recipientAddress) (32 bytes)
    recipient.substr(2); // recipientAddress      (?? bytes)

  console.log('\nConstructed deposit:');
  console.log(`  Resource Id: ${resourceId}`);
  console.log(`  Amount: ${amountInWei.toHexString()}`);
  console.log(`  len(recipient): ${(recipient.length - 2) / 2}`);
  console.log(`  Recipient: ${recipient}`);
  console.log(`  Raw: ${data}`);
  console.log('Creating deposit to initiate transfer!');

  // Make the deposit
  let tx = await bridge.deposit(
    dest, // destination chain id
    resourceId,
    data,
    { gasPrice: gasPrice, gasLimit: gasLimit },
  );

  // window.alert(`Transaction submitted!\n Transaction hash: ${tx.hash}`);
  await new Promise((resolve) => {
    notification.info({
      message: "transaction!",
      description:`Transaction submitted!\n Transaction hash: ${tx.hash}`,
      onClose: resolve, // Resolve the Promise when the notification is closed

  }) 
  })
  const res = await tx.wait();
  return res.status;
};

export const depositScallop = async (
  amount,
  dest,
  resourceId,
  currentNetwork,
  chainId,
  wallet,
) => {
  const bridgeAddr = bridgeParams[toHex(currentNetwork)][toHex(chainId)].bridge;
  const bridge = new ethers.Contract(bridgeAddr, bridgeScallopAbi, wallet);
  const recipient = await wallet.getAddress();

  let amountInWei = ethers.utils.parseUnits(amount.toString(), 'ether');
  let gasPrice = ethers.utils.hexlify(
    Number(networkParams[toHex(chainId)].gasPrice),
  );
  let gasLimit = ethers.utils.hexlify(
    Number(networkParams[toHex(chainId)].gasLimit),
  );

  const data =
    '0x' +
    ethers.utils.hexZeroPad(amountInWei.toHexString(), 32).substr(2) + // Deposit Amount        (32 bytes)
    ethers.utils
      .hexZeroPad(ethers.utils.hexlify((recipient.length - 2) / 2), 32)
      .substr(2) + // len(recipientAddress) (32 bytes)
    recipient.substr(2); // recipientAddress      (?? bytes)

  console.log('\nConstructed deposit:');
  console.log(`  Resource Id: ${resourceId}`);
  console.log(`  Amount: ${amountInWei.toHexString()}`);
  console.log(`  len(recipient): ${(recipient.length - 2) / 2}`);
  console.log(`  Recipient: ${recipient}`);
  console.log(`  Raw: ${data}`);
  console.log('Creating deposit to initiate transfer!');

  // Make the deposit
  let tx = await bridge.deposit(
    dest, // destination chain id
    resourceId,
    data,
    // { gasPrice: gasPrice, gasLimit: gasLimit },
  );

  // window.alert(`Transaction submitted!\n Transaction hash: ${tx.hash}`);
  await new Promise((resolve) => {
    notification.info({
      message: "pending",
      description:`Transaction submitted!\n Transaction hash: ${tx.hash}`,
      onClose: resolve, // Resolve the Promise when the notification is closed
    }) 
})

  const res = await tx.wait();
  return res.status;
};
