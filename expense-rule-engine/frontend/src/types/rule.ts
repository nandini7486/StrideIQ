export interface Rule {
  id: string;
  name: string;
  condition: string;
  actions: string[];
  active: boolean;
  updatedAt: string;
}

export interface EvaluationResult {
  matched_rules: string[];
  winning_rule: string | null;
  actions: string[];
  trace: Array<{
    rule: string;
    matched: boolean;
    reason: string;
  }>;
}

export interface Expense {
  expense_id: string;
  amount: number;
  category: string;
  working_hours?: number;
  employee_id: string;
  submitted_at: string;
  [key: string]: any; // Allow additional properties
}

export const OPERATORS = ['>', '<', '==', '!=', '>=', '<=', 'contains'] as const;
export type Operator = typeof OPERATORS[number];

export const FIELDS = ['amount', 'category', 'working_hours', 'merchant'] as const;
export type Field = typeof FIELDS[number];

export const ACTIONS = ['flag', 'reject', 'require_receipt', 'require_approval'] as const;
export type Action = typeof ACTIONS[number];

export interface Condition {
  field: Field;
  operator: Operator;
  value: string | number;
}
