import { BigNumber, ethers, utils } from 'ethers';
import { CoreContracts } from '../contracts';
import { Addresses } from '../constants';
import CoinGecko from 'coingecko-api';

const approximatedBlockPerDay = 6450;
const approximatedBlockPerMonth = Math.ceil((approximatedBlockPerDay * 365) / 12);

interface FotStats {
  daily: number;
  weekly: number;
  monthly: number;
}

const calculateApy = (
  fotStats: FotStats,
  totalTokenInVault: number,
  tokenPriceInUsd: number,
  corePriceInUsd: number
) => {
  const valueOfPoolInToken = totalTokenInVault * tokenPriceInUsd;

  return {
    daily: (fotStats.daily * 365 * corePriceInUsd * 100) / valueOfPoolInToken,
    weekly: (fotStats.weekly * (365 / 7) * corePriceInUsd * 100) / valueOfPoolInToken,
    monthly: (fotStats.monthly * (365 / 30) * corePriceInUsd * 100) / valueOfPoolInToken,
  };
};

export interface ICoreVaultApy {
  coreDaoApy: FotStats;
}

export class CoreVault {
  private _coinGeckoClient: CoinGecko;

  constructor(private _contracts: CoreContracts) {
    this._coinGeckoClient = new CoinGecko();
  }

  async getApyStats(): Promise<any> {
    const [totalCoreDaoStaked] = await this._contracts.all([
      this._contracts.CoreDAOContract.balanceOf(Addresses.CoreVault),
    ]);

    const decoder = new ethers.utils.AbiCoder();
    const toBlock = await this._contracts.provider.getBlockNumber();
    const fromBlock = toBlock - approximatedBlockPerMonth;

    const min7DaysBlockNumber = toBlock - approximatedBlockPerDay * 7;
    const min24HoursBlockNumber = toBlock - approximatedBlockPerDay;

    const vaultAddressHex = '0x000000000000000000000000c5cacb708425961594b63ec171f4df27a9c0d8c9';
    const logs = (
      await this._contracts.provider.getLogs({
        address: Addresses.CORE,
        topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'], // Transfer event
        fromBlock,
        toBlock,
      })
    )
      .sort((evOne, evTwo) => evOne.blockNumber - evTwo.blockNumber)
      .filter((log) => !log.removed && log.topics[2] === vaultAddressHex);

    const defaultFotStats = {
      daily: BigNumber.from(0),
      weekly: BigNumber.from(0),
      monthly: BigNumber.from(0),
    };

    const fotStats = logs.reduce((stats, log) => {
      const fot = decoder.decode(['uint256'], log.data)[0];

      if (log.blockNumber >= min24HoursBlockNumber) {
        stats.daily = stats.daily.add(fot);
      }

      if (log.blockNumber >= min7DaysBlockNumber) {
        stats.weekly = stats.weekly.add(fot);
      }

      stats.monthly = stats.monthly.add(fot);
      return stats;
    }, defaultFotStats);

    const fotStatsAsFloat = {
      daily: parseFloat(ethers.utils.formatEther(fotStats.daily)),
      weekly: parseFloat(ethers.utils.formatEther(fotStats.weekly)),
      monthly: parseFloat(ethers.utils.formatEther(fotStats.monthly)),
    } as FotStats;

    const totalCoreDaoStakedAsFloat = parseFloat(ethers.utils.formatEther(totalCoreDaoStaked));

    let data = await this._coinGeckoClient.simple.price({
      ids: ['cvault-finance'],
      vs_currencies: ['usd'],
    });
    const corePriceInUsd = data.data['cvault-finance'].usd.toString();
    const apy = calculateApy(fotStatsAsFloat, totalCoreDaoStakedAsFloat, 1, parseFloat(corePriceInUsd));

    return {
      coreDaoApy: {
        ...apy,
      },
    };
  }
}
