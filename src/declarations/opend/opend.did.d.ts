import type { Principal } from '@dfinity/principal';
export interface _SERVICE {
  'getListedNFT' : () => Promise<Array<Principal>>,
  'getListedNFTPrice' : (arg_0: Principal) => Promise<bigint>,
  'getOpenDCanister' : () => Promise<Principal>,
  'getOwnedNFTS' : (arg_0: Principal) => Promise<Array<Principal>>,
  'getoriginalOwner' : (arg_0: Principal) => Promise<Principal>,
  'isListed' : (arg_0: Principal) => Promise<boolean>,
  'listItem' : (arg_0: Principal, arg_1: bigint) => Promise<string>,
  'mint' : (arg_0: Array<number>, arg_1: string) => Promise<Principal>,
}
