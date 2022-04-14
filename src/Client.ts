import { Wallet } from 'ethers';
import { Provider } from 'ethers-multicall';
import { CoreContracts } from './contracts';
import { Lending } from './products/lending';

export class CoreClient {
  private _provider: Provider;
  private _wallet?: Wallet;
  private _contracts: CoreContracts;
  private _lending: Lending;

  constructor(provider: Provider, wallet?: Wallet) {
    this._provider = provider;
    this._wallet = wallet;
    this._contracts = new CoreContracts(provider);
    this._lending = new Lending(this._contracts);
  }

  public get lending(): Lending {
    return this._lending;
  }
}
