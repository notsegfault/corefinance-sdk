import { Contract, Signer, utils } from 'ethers';
import { BaseProvider, Provider } from '@ethersproject/providers';

import { CoreVaultInterface } from './abi';
import { ERC20Interface } from './abi/ERC20Interface';
import { LendingInterface } from './abi/LendingInterface';
import { getTokenLogoURL } from './utils';
import { TokenContract, TokenId, TokenInfo } from './types';
import { Addresses } from './constants';

export class CoreContracts {
  public TokenInfos: Map<TokenId, TokenInfo> = new Map();
  public DaiContract: Contract;
  public CoreContract: Contract;
  public CoreDAOContract: Contract;
  public CoreVaultContract: Contract;
  public LendingContract: Contract;
  public DaiToken: TokenContract;
  public CoreToken: TokenContract;
  public CoreDAOToken: TokenContract;

  public constructor(provider: BaseProvider) {
    this.DaiContract = new Contract(utils.getAddress(Addresses.DAI), ERC20Interface, provider);
    this.CoreContract = new Contract(utils.getAddress(Addresses.CORE), ERC20Interface, provider);
    this.CoreDAOContract = new Contract(utils.getAddress(Addresses.CoreDAO), ERC20Interface, provider);
    this.CoreVaultContract = new Contract(utils.getAddress(Addresses.CoreVault), CoreVaultInterface, provider);
    this.LendingContract = new Contract(utils.getAddress(Addresses.Lending), LendingInterface, provider);

    this.DaiToken = new TokenContract('Dai', 'DAI', this.DaiContract.address, this.DaiContract);
    this.CoreToken = new TokenContract('CORE', 'CORE', this.CoreContract.address, this.CoreContract);
    this.CoreDAOToken = new TokenContract('CoreDAO', 'COREDAO', this.CoreDAOContract.address, this.CoreDAOContract);

    this.TokenInfos.set(TokenId.Core, {
      name: 'CORE',
      collateral: true,
      value: TokenId.Core,
      iconUrl: getTokenLogoURL('0x62359Ed7505Efc61FF1D56fEF82158CcaffA23D7'),
      address: Addresses.CORE,
      isDisabled: false,
    });

    this.TokenInfos.set(TokenId.CoreDAO, {
      name: 'CoreDAO',
      collateral: true,
      value: TokenId.CoreDAO,
      iconUrl: getTokenLogoURL('0xf66Cd2f8755a21d3c8683a10269F795c0532Dd58'),
      address: Addresses.CoreDAO,
      isDisabled: false,
    });

    this.TokenInfos.set(TokenId.Dai, {
      name: 'DAI',
      value: TokenId.Dai,
      collateral: false,
      iconUrl: getTokenLogoURL('0x6B175474E89094C44Da98b954EedeAC495271d0F'),
      address: Addresses.DAI,
    });
  }
}
