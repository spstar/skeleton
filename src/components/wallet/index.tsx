import { useEffect, useMemo } from 'react';
import { getElfDispatch, getElfState, useElfSubscribe } from 'react-elf';
import Web3 from 'web3';
import { usePersistFn } from '@/utils/hooks';
import Toast from '@/components/toast';
import { t } from 'i18next';
import { CURRENT_ENV_CHAIN_ID } from '@/constants';
import { CHAIN_NETWORKS } from '@/constants/chainNetworks';

const ethereum = window.ethereum;

interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

function installWalletTips() {
  Toast({
    duration: 0,
    content: String(t('installWalletTips'))
  });
}

function Wallet() {
  const [[block, chainId], dispatch] = useElfSubscribe('global', [
    'block',
    'chainId'
  ]);
  const pollingBlockUpdate = usePersistFn(() => {
    if (!ethereum || !chainId) {
      return void 0;
    }

    const web3 = new Web3(ethereum as any);
    const blockTime = getBlockTime(chainId);
    const interval = setInterval(async () => {
      web3.eth.getBlockNumber().then((blockNum) => {
        block !== blockNum && dispatch('setBlock', blockNum);
      });
    }, blockTime * 1000);

    return () => clearInterval(interval);
  });

  useEffect(pollingBlockUpdate, [chainId, pollingBlockUpdate]);
  useMemo(() => {
    if (ethereum) {
      ethereum.request({ method: 'eth_chainId' }).then((id) => {
        dispatch('setChainId', id);
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (!ethereum) {
      return void 0;
    }

    function onChainChanged(id: string) {
      // chainId !== id && dispatch('setChainId', id);
      window.location.reload();
    }

    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', onChainChanged);
    return () => {
      if (!ethereum) {
        return void 0;
      }
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
      ethereum.removeListener('chainChanged', onChainChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export function getBlockTime(chainId: string | number): number {
  switch (Number(chainId)) {
    case 56:
    case 97:
      return 3;
    case 66:
      return 3.6;
    default:
      return 12;
  }
}

export const handleAccountsChanged = (accounts: string[]) => {
  const { account } = getElfState('global');
  const dispatch = getElfDispatch('global');
  if (accounts.length === 0) {
    // MetaMask is locked or the user has not connected any accounts
    console.log('Please connect to MetaMask.');
  } else if (accounts[0] !== account) {
    dispatch('setAccount', accounts[0]);
  }

  return true;
};

export const connect = () => {
  if (!ethereum) {
    return void 0;
  }
  ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(handleAccountsChanged)
    .catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    });
};

export async function addWalletChain(
  chainNetOrId: AddEthereumChainParameter | string
) {
  if (!ethereum) {
    return installWalletTips();
  }

  if (typeof chainNetOrId === 'string') {
    chainNetOrId =
      CHAIN_NETWORKS.find((item) => item.chainId === chainNetOrId) || '';
  }

  if (!chainNetOrId) {
    return Toast({
      content: String(t('noFindChainNetwork'))
    });
  }

  try {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [chainNetOrId]
    });
  } catch (addError: any) {
    Toast({
      content: `Uncaught exception at add chain network! code: ${addError.code}`
    });
    Toast({
      duration: 0,
      content: `Please add the network manually(chain_id: ${CURRENT_ENV_CHAIN_ID})`
    });
  }
}

export async function switchWalletChainId() {
  if (!ethereum) {
    return installWalletTips();
  }

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: Web3.utils.toHex(CURRENT_ENV_CHAIN_ID) }]
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (
      switchError.code === 4902 ||
      switchError.data?.originalError.code === 4902
    ) {
      addWalletChain(Web3.utils.toHex(CURRENT_ENV_CHAIN_ID));
    } else {
      Toast({
        content: `Uncaught exception at switch chain! code: ${switchError.code}`
      });
    }
  }
}

export default Wallet;
