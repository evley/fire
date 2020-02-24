import { ImportMethod } from '@evley/importer';

export const CONSTANTS: Constants = {
  appId: 'FIRE',
  importMethods: [ImportMethod.CSV],
  fireMultiplier: 25,
  projectLink: 'https://github.com/evley/fire',
  templateLink: 'https://github.com/evley/fire/tree/master/src/assets/template',
  financial: {
    income: 'income',
    expenditure: 'expenditure',
    essential: 'essential',
    profit: 'profit',
    fireReq: 'FIRE fund required',
    fireTime: 'FIRE time',
    liability: 'liability',
    assets: 'assets'
  }
};

export interface Constants {
  appId: 'FIRE';
  importMethods: Array<keyof typeof ImportMethod>;
  fireMultiplier: number;
  projectLink: string;
  templateLink: string;
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
