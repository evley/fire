export interface FinanceGroup {
  name: string;
  value: number;
}

export interface Financial {
  income: FinanceGroup;
  expenditure: FinanceGroup;
  profit: FinanceGroup;
  fireReq: FinanceGroup;
  fireTime: FinanceGroup;
  liability: FinanceGroup;
  assets: FinanceGroup;
}
