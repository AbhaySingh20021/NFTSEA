import type { Principal } from '@dfinity/principal';
export interface _SERVICE {
  'getOpenDCanister' : () => Promise<Principal>,
  'getOwnedNFTS' : (arg_0: Principal) => Promise<Array<Principal>>,
  'isListed' : (arg_0: Principal) => Promise<boolean>,
  'listItem' : (arg_0: Principal, arg_1: bigint) => Promise<string>,
  'mint' : (arg_0: Array<number>, arg_1: string) => Promise<Principal>,
}
