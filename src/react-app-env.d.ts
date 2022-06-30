/// <reference types="react-scripts" />
/// <reference types="node" />

// customize global vars;
interface Window {
  // $: (s:string) => any;
  swiperIns: any;
  ethereum?: {
    chainId?: string;
    isMetaMask?: true;
    isImToken?: boolean;
    isTokenPocket?: boolean;
    on: (...args: any[]) => void;
    removeListener: (...args: any[]) => void;
    autoRefreshOnNetworkChange?: boolean;
    request: (...args: any[]) => Promise<any>;
    rpc?: any;
  };
}
