import { 
  Rule, 
  Expense, 
  EvaluationResponse, 
  RuleAction, 
  getHighestPriorityAction, 
  EvaluationTrace,
  EvaluationResult 
} from '../types';

// In-memory storage for rules
let rules: Rule[] = [
  {
    id: 'r1',
    name: 'Large expense',
    condition: 'amount > 200',
    actions: ['flag'],
    active: true
  },
  {
    id: 'r2',
    name: 'High expense with overtime',
    condition: 'amount > 200 && working_hours > 12',
    actions: ['reject'],
    active: true
  },
  {
    id: 'r3',
    name: 'Food expense over 100',
    condition: 'category == "Food" && amount > 100',
    actions: ['require_receipt'],
    active: true
  },
  {
    id: 'r4',
    name: 'Manager approval required',
    condition: 'amount > 1000',
    actions: ['require_approval'],
    active: true
  },
  {
    id: 'r5',
    name: 'Auto-approve small expenses',
    condition: 'amount <= 50',
    actions: ['accept'],
    active: true
  }
];

// Export the rules array
export { rules };

// Helper function to safely evaluate conditions
export function evaluateCondition(condition: string, expense: Expense): boolean {
  try {
    // Create a safe evaluation context with only the expense properties
    const context = { ...expense };
    
    // Convert the condition to a function that can be evaluated
    const func = new Function(...Object.keys(context), `return ${condition};`);
    
    // Call the function with the expense properties as arguments
    return func(...Object.values(context));
  } catch (error) {
    console.error(`Error evaluating condition: ${condition}`, error);
    return false;
  }
}

// Get all rules
export function getAllRules(): Rule[] {
  return [...rules];
};

// Get a rule by ID
export function getRuleById(id: string): Rule | undefined {
  return rules.find(rule => rule.id === id);
};

// Add a new rule
export function addRule(rule: Omit<Rule, 'id'>): Rule {
  const newRule: Rule = {
    ...rule,
    id: `r${rules.length + 1}`
  };
  rules.push(newRule);
  return newRule;
};

// Update an existing rule
export function updateRule(id: string, updatedRule: Partial<Rule>): Rule | null {
  const index = rules.findIndex(rule => rule.id === id);
  if (index === -1) return null;
  
  rules[index] = { ...rules[index], ...updatedRule };
  return rules[index];
};

// Delete a rule
export function deleteRule(id: string): boolean {
  const initialLength = rules.length;
  rules = rules.filter(rule => rule.id !== id);
  return rules.length < initialLength;
};

// Reorder rules based on provided IDs
export function reorderRules(ruleIds: string[]): boolean {
  try {
    // Create a map of rule IDs to their indices for faster lookup
    const idToIndex = new Map<string, number>();
    rules.forEach((rule, index) => idToIndex.set(rule.id, index));
    
    // Create a new array with the specified order
    const newRules: Rule[] = [];
    
    // Add rules in the specified order
    for (const id of ruleIds) {
      const index = idToIndex.get(id);
      if (index !== undefined) {
        newRules.push(rules[index]);
      }
    }
    
    // Add any remaining rules that weren't in the specified order
    for (let i = 0; i < rules.length; i++) {
      if (!ruleIds.includes(rules[i].id)) {
        newRules.push(rules[i]);
      }
    }
    
    // Update the rules array
    rules = newRules;
    return true;
  } catch (error) {
    console.error('Error reordering rules:', error);
    return false;
  }
}

// Helper function to determine the final status based on actions
function determineStatus(actions: RuleAction[]): { status: 'accepted' | 'rejected' | 'needs_review', message: string } {
  if (actions.length === 0) {
    return { status: 'accepted', message: 'No rules matched - expense accepted by default' };
  }

  const highestPriorityAction = getHighestPriorityAction(actions);
  
  switch (highestPriorityAction) {
    case 'reject':
      return { status: 'rejected', message: 'Expense rejected based on rules' };
    case 'accept':
      return { status: 'accepted', message: 'Expense accepted based on rules' };
    case 'require_approval':
      return { status: 'needs_review', message: 'Expense requires manual approval' };
    case 'require_receipt':
      return { status: 'needs_review', message: 'Receipt required for this expense' };
    case 'flag':
    default:
      return { status: 'needs_review', message: 'Expense flagged for review' };
  }
}

// Evaluate an expense against all rules
export function evaluateExpense(expense: Expense): EvaluationResponse {
  const trace: EvaluationTrace[] = [];
  const matchedRules: string[] = [];
  const allActions = new Set<RuleAction>();
  
  // Evaluate each active rule
  for (const rule of rules) {
    if (!rule.active) continue;
    
    const matched = evaluateCondition(rule.condition, expense);
    const ruleActions = matched ? [...rule.actions] : [];
    
    trace.push({
      rule: rule.name,
      matched,
      reason: matched ? rule.condition : `${rule.condition} - condition not met`,
      actions: ruleActions
    });
    
    if (matched) {
      matchedRules.push(rule.id);
      rule.actions.forEach(action => allActions.add(action));
    }
  }
  
  // Determine the winning rule (most specific - has the most conditions)
  let winningRule: string | null = null;
  let maxConditions = 0;
  
  for (const ruleId of matchedRules) {
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      const conditionCount = rule.condition.split('&&').length;
      if (conditionCount > maxConditions) {
        maxConditions = conditionCount;
        winningRule = rule.id;
      }
    }
  }
  
  // Convert actions set to array and determine status
  const actions = Array.from(allActions);
  const { status, message } = determineStatus(actions);
  
  // Create the evaluation result
  const result: EvaluationResult = {
    status,
    message,
    actions,
    matched_rules: matchedRules,
    winning_rule: winningRule,
    trace
  };
  
  // Convert to response format (with string[] for actions for backward compatibility)
  return {
    ...result,
    actions: actions.map(a => String(a)) // Convert RuleAction[] to string[]
  };
}
