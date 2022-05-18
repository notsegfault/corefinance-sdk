import { BigNumber, utils, Wallet } from 'ethers';
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

export interface IRepayAmount {
  amountInCore: BigNumber;
  amountInCoreDAO: BigNumber;
  amountInDai: BigNumber;
}

export interface IRepayAmounts {
  minimum: IRepayAmount;
  maximum: IRepayAmount;
}

export class Lending {
  constructor(private _contracts: CoreContracts, private _wallet?: Wallet) {}

  async addCollateral(collateralTokenAddress: string, collateralAmount: BigNumber) {
    return this._contracts.LendingContract.connect(this._wallet).addCollateral(
      collateralTokenAddress,
      collateralAmount
    );
  }

  async addCollateralAndBorrow(collateralTokenAddress: string, collateralAmount: BigNumber, borrowAmount: BigNumber) {
    return this._contracts.LendingContract.connect(this._wallet).addCollateralAndBorrow(
      collateralTokenAddress,
      collateralAmount,
      borrowAmount
    );
  }

  async borrow(borrowAmount: BigNumber) {
    return this._contracts.LendingContract.connect(this._wallet).borrow(borrowAmount);
  }

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

  async getRepayAmounts(account: string, secondsToAdd = 300 /* 5 mins */): Promise<IRepayAmounts> {
    const [debtorSummary, yearlyPercentInterest, collaterabilityOfCore, collaterabilityOfCoreDAO] =
      await this._contracts.all([
        this._contracts.LendingContract.debtorSummary(account),
        this._contracts.LendingContract.yearlyPercentInterest(),
        this._contracts.LendingContract.collaterabilityOfToken(utils.getAddress(Addresses.CORE)),
        this._contracts.LendingContract.collaterabilityOfToken(utils.getAddress(Addresses.CoreDAO)),
      ]);

    const blockNumber = await this._contracts.provider.getBlockNumber();
    const timestamp = (await this._contracts.provider.getBlock(blockNumber)).timestamp;

    const timeSinceLastLoan = BigNumber.from(timestamp)
      .add(BigNumber.from(secondsToAdd))
      .sub(debtorSummary.timeLastBorrow);

    const fullAccruedInterest = debtorSummary.amountDAIBorrowed
      .mul(yearlyPercentInterest)
      .div(BigNumber.from(100))
      .mul(timeSinceLastLoan)
      .div(BigNumber.from(365 * 24 * 60 * 60));

    const totalDebt = debtorSummary.amountDAIBorrowed.add(fullAccruedInterest);

    return {
      minimum: {
        amountInCore: fullAccruedInterest.div(collaterabilityOfCore),
        amountInCoreDAO: fullAccruedInterest.div(collaterabilityOfCoreDAO),
        amountInDai: fullAccruedInterest,
      },
      maximum: {
        amountInCore: totalDebt.div(collaterabilityOfCore),
        amountInCoreDAO: totalDebt.div(collaterabilityOfCoreDAO),
        amountInDai: totalDebt,
      },
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
