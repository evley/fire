export interface DataItem {
  id: number;
  name: string;
  image: string;
  icon: string;
  impact: number;
  negative: string[];
  positive: string[];
  income: number;
  expenditure: number;
  debt: number;
  savings: number;
  active: boolean;
}
