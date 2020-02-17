import { ImportMethod } from '@evley/importer';

export const CONSTANTS: Constants = {
  appId: 'FIRE',
  importMethods: [ImportMethod.CSV],
  positive: 'positive',
  negative: 'negative',
  impact: 'impact',
  financial: {
    currency: 'GBP',
    income: 'income',
    expenditure: 'expenditure',
    profit: 'profit',
    debt: 'debt',
    savings: 'savings'
  }
};

export interface Constants {
  appId: 'FIRE';
  importMethods: Array<keyof typeof ImportMethod>;
  positive: string;
  negative: string;
  impact: string;
  financial: {
    currency: string;
    income: string;
    expenditure: string;
    profit: string;
    debt: string;
    savings: string;
  };
}
