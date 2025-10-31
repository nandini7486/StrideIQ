import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Rule } from '@/types/rule';
import { fetchRules, createRule as createRuleApi, updateRule as updateRuleApi, deleteRule as deleteRuleApi, evaluateExpense as evaluateExpenseApi } from '@/services/api';

interface RuleContextType {
  rules: Rule[];
  loading: boolean;
  error: string | null;
  addRule: (rule: Omit<Rule, 'id'>) => Promise<void>;
  updateRule: (id: string, rule: Partial<Rule>) => Promise<void>;
  deleteRule: (id: string) => Promise<void>;
  toggleRule: (id: string) => void;
  reorderRules: (startIndex: number, endIndex: number) => void;
  evaluateExpense: (expense: any) => Promise<{
    matched_rules: string[];
    winning_rule: string | null;
    actions: string[];
    trace: Array<{ rule: string; matched: boolean; reason: string }>;
  }>;
}

const RuleContext = createContext<RuleContextType | undefined>(undefined);

export const RuleProvider = ({ children }: { children: ReactNode }) => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load rules from the API when the component mounts
  useEffect(() => {
    const loadRules = async () => {
      try {
        setLoading(true);
        const data = await fetchRules();
        setRules(data);
      } catch (err) {
        setError('Failed to load rules');
        console.error('Error loading rules:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRules();
  }, []);

  const addRule = async (ruleData: Omit<Rule, 'id'>) => {
    try {
      const newRule = await createRuleApi(ruleData);
      setRules([...rules, newRule]);
    } catch (err) {
      setError('Failed to create rule');
      console.error('Error creating rule:', err);
      throw err;
    }
  };

  const updateRule = async (id: string, updates: Partial<Rule>) => {
    try {
      const updatedRule = await updateRuleApi(id, updates);
      setRules(rules.map(rule => 
        rule.id === id ? { ...rule, ...updatedRule } : rule
      ));
    } catch (err) {
      setError('Failed to update rule');
      console.error('Error updating rule:', err);
      throw err;
    }
  };

  const deleteRule = async (id: string) => {
    try {
      await deleteRuleApi(id);
      setRules(rules.filter(rule => rule.id !== id));
    } catch (err) {
      setError('Failed to delete rule');
      console.error('Error deleting rule:', err);
      throw err;
    }
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, active: !rule.active } : rule
    ));
  };

  const reorderRules = (startIndex: number, endIndex: number) => {
    const result = Array.from(rules);
    const [movedItem] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, movedItem);
    setRules([...result]);
  };

  const evaluateExpense = async (expense: any) => {
    try {
      const result = await evaluateExpenseApi(expense);
      return result;
    } catch (err) {
      setError('Failed to evaluate expense');
      console.error('Error evaluating expense:', err);
      throw err;
    }
  };

  return (
    <RuleContext.Provider value={{
      rules,
      loading,
      error,
      addRule,
      updateRule,
      deleteRule,
      toggleRule,
      reorderRules,
      evaluateExpense,
    }}>
      {children}
    </RuleContext.Provider>
  );
};
export const useRules = () => {
  const context = useContext(RuleContext);
  if (context === undefined) {
    throw new Error('useRules must be used within a RuleProvider');
  }
  return context;
};
