import { ReducerPiece, Action } from 'react-elf';
import { WALLET_ACCOUNT_STORED_KEY } from '@/constants';

interface StateType {
  chainId: number | undefined;
  account: string | undefined;
  block: string | undefined;
}
const initState: StateType = {
  chainId: undefined,
  account: window.localStorage.getItem(WALLET_ACCOUNT_STORED_KEY) || undefined,
  block: undefined
};

function reducer(state: StateType, action: Action): StateType {
  switch (action.type) {
    case 'setChainId':
      return { ...state, chainId: action.payload };

    case 'setAccount':
      window.localStorage.setItem(WALLET_ACCOUNT_STORED_KEY, action.payload);
      return { ...state, account: action.payload };

    case 'setBlock':
      return { ...state, block: action.payload };

    default:
      return state;
  }
}

export default {
  reducer,
  name: 'global',
  init: initState
} as ReducerPiece;
