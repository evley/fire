export interface FinanceGroup {
  name: string;
  value: number;
}

export interface Financial {
  income: FinanceGroup;
  expenditure: FinanceGroup;

  profit: FinanceGroup;
  liability: FinanceGroup;
  assets: FinanceGroup;
}
