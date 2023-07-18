function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const waitForTx = async (provider, hash) => {
  console.log(`Waiting for tx: ${hash}...`);
  while (!(await provider.getTransactionReceipt(hash))) {
    sleep(5000);
  }
};

export const truncateAddress = (address) => {
  if (!address) return 'No Account';
  const match = address.match(
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/,
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

export const toHex = (num) => {
  const val = Number(num);
  return '0x' + val.toString(16);
};
