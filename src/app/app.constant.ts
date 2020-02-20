import { ImportMethod } from '@evley/importer';

export const CONSTANTS: Constants = {
  appId: 'FIRE',
  importMethods: [ImportMethod.CSV],
  id: 'id',
  financial: {
    currency: 'GBP',
    income: 'income',
    expenditure: 'expenditure',
    essential: 'essential',
    profit: 'profit',
    liability: 'liability',
    assets: 'assets'
  }
};

export interface Constants {
  appId: 'FIRE';
  importMethods: Array<keyof typeof ImportMethod>;
  id: string;
  financial: {
    currency: string;
    income: string;
    expenditure: string;
    essential: string;
    profit: string;
    liability: string;
    assets: string;
  };
}
