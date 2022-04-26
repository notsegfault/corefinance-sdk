import { BigNumber, utils } from 'ethers';
import { CoreContracts } from '../contracts';
import { Addresses } from '../constants';

export interface IGlobalLendingInfo {
  yearlyPercentInterest: BigNumber;
  loanDefaultThresholdPercent: BigNumber;
  collaterabilityOfCore: BigNumber;
  collaterabilityOfCoreDAO: BigNumber;
  daiLeftToBorrow: BigNumber;
}

export interface IUserLendingInfo {
  userCollateralValue: BigNumber;
  userTotalDebt: BigNumber;
  debtorSummary: BigNumber;
  userCollaterals: BigNumber;
  accruedInterest: BigNumber;
}

export class Lending {
  constructor(private _contracts: CoreContracts) {}

  async getUserStats(account: string): Promise<IUserLendingInfo> {
    const [userCollateralValue, userTotalDebt, debtorSummary, userCollaterals, accruedInterest] =
      await this._contracts.all([
        this._contracts.LendingContract.userCollateralValue(account),
        this._contracts.LendingContract.userTotalDebt(account),
        this._contracts.LendingContract.debtorSummary(account),
        this._contracts.LendingContract.userCollaterals(account),
        this._contracts.LendingContract.accruedInterest(account),
      ]);

    return {
      userCollateralValue,
      userTotalDebt,
      debtorSummary,
      userCollaterals,
      accruedInterest,
    };
  }

  async getGlobalStats(): Promise<IGlobalLendingInfo> {
    const [
      yearlyPercentInterest,
      loanDefaultThresholdPercent,
      collaterabilityOfCore,
      collaterabilityOfCoreDAO,
      daiLeftToBorrow,
    ] = await this._contracts.all([
      this._contracts.LendingContract.yearlyPercentInterest(),
      this._contracts.LendingContract.loanDefaultThresholdPercent(),
      this._contracts.LendingContract.collaterabilityOfToken(utils.getAddress(Addresses.CORE)),
      this._contracts.LendingContract.collaterabilityOfToken(utils.getAddress(Addresses.CoreDAO)),
      this._contracts.DaiContract.balanceOf(this._contracts.LendingContract.address),
    ]);

    return {
      yearlyPercentInterest,
      loanDefaultThresholdPercent,
      collaterabilityOfCore,
      collaterabilityOfCoreDAO,
      daiLeftToBorrow,
    };
  }
}
