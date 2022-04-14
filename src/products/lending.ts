import { BigNumber } from 'ethers';
import { CoreContracts } from '../contracts';

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
}
