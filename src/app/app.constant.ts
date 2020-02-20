import { ImportMethod } from '@evley/importer';

export const CONSTANTS: Constants = {
  appId: 'FIRE',
  importMethods: [ImportMethod.CSV],
  fireMultiplier: 25,
  financial: {
    income: 'income',
    expenditure: 'expenditure',
    essential: 'essential',
    profit: 'profit',
    fireReq: 'FIRE req.',
    fireTime: 'FIRE time',
    liability: 'liability',
    assets: 'assets'
  }
};

export interface Constants {
  appId: 'FIRE';
  importMethods: Array<keyof typeof ImportMethod>;
  fireMultiplier: number;
  financial: {
    income: string;
    expenditure: string;
    essential: string;
    profit: string;
    fireReq: string;
    fireTime: string;
    liability: string;
    assets: string;
  };
}
