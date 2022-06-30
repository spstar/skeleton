import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';

const ethereum = window.ethereum;
const getETHBalance = async (
  ethereum: any,
  account: string
): Promise<BigNumber | undefined> => {
  try {
    const balance = await ethereum.request({
      method: 'eth_getBalance',
      params: [account, 'latest']
    });

    return new BigNumber(balance);
  } catch (e) {
    console.error(e);
    return void 0;
  }
};

export const useETHBalance = (account: string | null) => {
  const [balance, setBalance] = useState<BigNumber>();

  useEffect(() => {
    if (!account || !ethereum) {
      return void 0;
    }

    getETHBalance(ethereum, account).then((balance) => {
      setBalance(balance);
    });
  }, [account]);

  return balance;
};
