export interface FinanceGroup {
  name: string;
  active: boolean;
  value: number;
}

export interface Financial {
  income: FinanceGroup;
  expenditure: FinanceGroup;
  profit: FinanceGroup;
  debt: FinanceGroup;
  savings: FinanceGroup;
}
