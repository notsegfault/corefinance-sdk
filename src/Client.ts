import { ethers, Wallet } from 'ethers';
import { Provider } from 'ethers-multicall';
import { CoreContracts } from './contracts';
import { CoreVault } from './products/corevault';
import { Lending } from './products/lending';

export class CoreClient {
  private _contracts: CoreContracts;
  private _lending: Lending;
  private _coreVault: CoreVault;

  constructor(
    private _provider: Provider,
    private _nativeProvider: ethers.providers.BaseProvider,
    private _wallet?: Wallet
  ) {
    this._contracts = new CoreContracts(_provider, _nativeProvider);
    this._lending = new Lending(this._contracts);
    this._coreVault = new CoreVault(this._contracts);
  }

  public get lending(): Lending {
    return this._lending;
  }

  public get corevault(): CoreVault {
    return this._coreVault;
  }
}
