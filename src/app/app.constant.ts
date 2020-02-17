import { ImportMethod } from '@evley/importer';

export const CONSTANTS: Constants = {
  appId: 'FIRE',
  importMethods: [ImportMethod.CSV],
  id: 'id',
  positive: 'positive',
  negative: 'negative',
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
  id: string;
  positive: string;
  negative: string;
  financial: {
    currency: string;
    income: string;
    expenditure: string;
    profit: string;
    debt: string;
    savings: string;
  };
}
