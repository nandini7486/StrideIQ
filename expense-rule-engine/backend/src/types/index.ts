// Define possible rule actions
export type RuleAction = 'flag' | 'accept' | 'reject' | 'require_receipt' | 'require_approval';

// Define action priorities (lower number = higher priority)
const ACTION_PRIORITIES: Record<RuleAction, number> = {
  'reject': 1,
  'accept': 2,
  'require_approval': 3,
  'require_receipt': 4,
  'flag': 5
} as const;

export interface Rule {
  id: string;
  name: string;
  condition: string;
  actions: RuleAction[];
  active: boolean;
  priority?: number; // Optional priority to override default action priorities
}

// Helper to get action priority
export function getActionPriority(action: RuleAction): number {
  return ACTION_PRIORITIES[action];
}

// Helper to get the highest priority action from a list
export function getHighestPriorityAction(actions: RuleAction[]): RuleAction | null {
  if (actions.length === 0) return null;
  return actions.reduce((highest, current) => {
    return getActionPriority(current) < getActionPriority(highest) ? current : highest;
  });
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

export interface RuleEvaluationResult {
  ruleId: string;
  matched: boolean;
  reason: string;
}

export interface EvaluationTrace {
  rule: string;
  matched: boolean;
  reason: string;
  actions: RuleAction[];
}

export interface EvaluationResult {
  status: 'accepted' | 'rejected' | 'needs_review';
  actions: RuleAction[];
  message: string;
  matched_rules: string[];
  winning_rule: string | null;
  trace: EvaluationTrace[];
}

export interface EvaluationResponse extends Omit<EvaluationResult, 'actions'> {
  // For backward compatibility, include string[] version of actions
  actions: string[];
}
