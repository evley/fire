import { ImportMethod } from '@evley/importer';

export const CONSTANTS: Constants = {
  appId: 'FIRE',
  importMethods: [ImportMethod.CSV],
  fireMultiplier: 25,
  financial: {
    currency: 'GBP',
    income: 'income',
    expenditure: 'expenditure',
    essential: 'essential',
    profit: 'profit',
    FIRE: 'FIRE',
    liability: 'liability',
    assets: 'assets'
  }
};

export interface Constants {
  appId: 'FIRE';
  importMethods: Array<keyof typeof ImportMethod>;
  fireMultiplier: number;
  financial: {
    currency: string;
    income: string;
    expenditure: string;
    essential: string;
    profit: string;
    FIRE: string;
    liability: string;
    assets: string;
  };
}
