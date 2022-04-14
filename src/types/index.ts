import { Contract } from 'ethers-multicall';

export enum TokenId {
  Dai,
  Core,
  CoreDAO,
}

export interface Apy {
  daily: number;
  weekly: number;
  monthly: number;
}

export interface TokenInfo {
  name: string;
  iconUrl: string;
  value: TokenId;
  collateral: boolean;
  address: string;
  isDisabled?: boolean;
}

export class TokenContract {
  constructor(
    public readonly name: string,
    public readonly ticker: string,
    public readonly address: string,
    public readonly contract: Contract
  ) {}
}
