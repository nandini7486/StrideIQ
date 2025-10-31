import { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import type { Rule, Condition, Action, Field, Operator } from '@/types/rule';
import { OPERATORS, FIELDS, ACTIONS } from '@/types/rule';

const OPERATOR_LABELS: Record<string, string> = {
  '>': 'greater than',
  '<': 'less than',
  '>=': 'greater than or equal to',
  '<=': 'less than or equal to',
  '==': 'equals',
  '!=': 'not equals',
  'contains': 'contains'
};

const FIELD_LABELS: Record<string, string> = {
  'amount': 'Amount',
  'category': 'Category',
  'working_hours': 'Working Hours',
  'merchant': 'Merchant'
};

const ACTION_LABELS: Record<string, string> = {
  'approved': 'Approve',
  'rejected': 'Reject',
  'manager_approval_needed': 'Require Manager Approval'
};
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRules } from '@/context/RuleContext';

// Simple switch component since we can't import it
const Switch = ({
  checked,
  onCheckedChange,
  className = '',
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${checked ? 'bg-black' : 'bg-gray-200'} ${className}`}
  >
    <span
      className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
    />
  </button>
);

interface RuleEditorProps {
  rule: Rule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export default function RuleEditor({ rule, open, onOpenChange, onSave }: RuleEditorProps) {
  const { addRule, updateRule } = useRules();
  const [name, setName] = useState('');
  const [condition, setCondition] = useState<Condition[]>([{ field: 'amount', operator: '>', value: '' }]);
  const [actions, setActions] = useState<Action[]>(['approved']);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (rule) {
      setName(rule.name);
      setIsActive(rule.active);
      setActions(rule.actions as Action[] || ['approved']);
      
      // Parse condition string into condition objects
      const parseConditions = () => {
        try {
          const conditions: Condition[] = [];
          if (rule.condition) {
            const parts = rule.condition.split('&&').map(part => part.trim());
            
            for (const part of parts) {
              let matched = false;
              for (const op of OPERATORS) {
                if (part.includes(op)) {
                  const [left, right] = part.split(op).map(s => s.trim());
                  if (FIELDS.includes(left as Field)) {
                    conditions.push({
                      field: left as Field,
                      operator: op as Operator,
                      value: right.replace(/['"]/g, '')
                    });
                    matched = true;
                    break;
                  }
                }
              }
              if (!matched && part.trim()) {
                // If no operator matched, default to amount > 0
                conditions.push({ 
                  field: 'amount', 
                  operator: '>', 
                  value: '0' 
                });
              }
            }
            
            if (conditions.length > 0) {
              setCondition(conditions);
            }
          }
        } catch (e) {
          console.error('Error parsing condition:', e);
          setCondition([{ field: 'amount', operator: '>', value: '' }]);
        }
      };
      
      parseConditions();
    } else {
      // Reset form for new rule
      setName('');
      setCondition([{ field: 'amount', operator: '>', value: '' }]);
      setActions([]);
      setIsActive(true);
    }
  }, [rule, open]);

  const addCondition = () => {
    if (condition.length < 5) { // Limit number of conditions
      setCondition([...condition, { field: 'amount', operator: '>', value: '' }]);
    }
  };

  const removeCondition = (index: number) => {
    if (condition.length > 1) { // Keep at least one condition
      const newConditions = [...condition];
      newConditions.splice(index, 1);
      setCondition(newConditions);
    }
  };

  const toggleAction = (action: Action) => {
    setActions(prev => 
      prev.includes(action)
        ? prev.filter(a => a !== action)
        : [...prev, action]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !condition.length || !actions.length) return;
    
    try {
      // Convert conditions to a string
      const conditionString = condition
        .filter(c => c.value !== '')
        .map(c => {
          const value = typeof c.value === 'string' && !c.value.match(/^\d+$/) && !c.value.startsWith('"')
            ? `"${c.value}"`
            : c.value;
          return `${c.field} ${c.operator} ${value}`;
        })
        .join(' && ');

      const ruleData = {
        name: name.trim(),
        condition: conditionString,
        actions: actions,
        active: isActive,
        priority: 1, // Default priority
        createdAt: rule?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (rule) {
        await updateRule(rule.id, ruleData);
      } else {
        await addRule(ruleData);
      }
      
      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving rule:', error);
    }
  };

  const updateCondition = (
  index: number, 
  key: keyof Condition, 
  value: string | number
) => {
  const newConditions = [...condition];
  if (key === 'field') {
    newConditions[index][key] = value as Field;
  } else if (key === 'operator') {
    newConditions[index][key] = value as Operator;
  } else {
    newConditions[index][key] = value; // value is string | number
  }
  setCondition(newConditions);
};
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="px-6 py-4 border-b border-[#E5E5E5]">
          <h2 className="text-lg font-medium">{rule ? 'Edit Rule' : 'Create Rule'}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-[#666666] block mb-2">
              Rule Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. High Amount Approval"
              className="h-10 border-[#E5E5E5] focus:border-black focus:ring-black rounded"
              required
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-[#666666]">Conditions</Label>
              <button
                type="button"
                onClick={addCondition}
                disabled={condition.length >= 5}
                className="text-sm text-black hover:text-gray-800 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Condition
              </button>
            </div>
            
            <div className="space-y-3">
              {condition.map((cond, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="grid grid-cols-3 gap-3 flex-1">
                    <div>
                      <Select
                        value={cond.field}
                        onValueChange={(value) => updateCondition(index, 'field', value as Field)}
                      >
                        <SelectTrigger className="h-10 border-[#E5E5E5] focus:border-black focus:ring-black rounded">
                          <SelectValue placeholder="Field" />
                        </SelectTrigger>
                        <SelectContent>
                          {FIELDS.map((field) => (
                            <SelectItem key={field} value={field}>
                              {FIELD_LABELS[field] || field}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Select
                        value={cond.operator}
                        onValueChange={(value) => updateCondition(index, 'operator', value as Operator)}
                      >
                        <SelectTrigger className="h-10 border-[#E5E5E5] focus:border-black focus:ring-black rounded">
                          <SelectValue placeholder="Operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {OPERATORS.map((op) => (
                            <SelectItem key={op} value={op}>
                              {OPERATOR_LABELS[op] || op}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex">
                      <Input
                        value={cond.value}
                        onChange={(e) => updateCondition(index, 'value', e.target.value)}
                        placeholder="Value"
                        className="h-10 border-[#E5E5E5] focus:border-black focus:ring-black rounded-r-none"
                      />
                      {condition.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCondition(index)}
                          className="inline-flex items-center px-3 border border-l-0 border-[#E5E5E5] bg-white text-[#999999] hover:text-[#666666] rounded-r-md"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-[#666666] block mb-3">Actions</Label>
            <div className="space-y-3">
              {ACTIONS.map((action) => (
                <div key={action} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`action-${action}`}
                    checked={actions.includes(action)}
                    onChange={() => toggleAction(action)}
                    className="h-4 w-4 rounded border-[#E5E5E5] text-black focus:ring-black"
                  />
                  <Label htmlFor={`action-${action}`} className="ml-2 text-sm text-[#333333]">
                    {ACTION_LABELS[action] || action}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                className={isActive ? 'bg-black' : 'bg-[#E5E5E5]'}
              />
              <Label htmlFor="active-status" className="text-sm font-medium text-[#333333]">
                {isActive ? 'Active' : 'Inactive'}
              </Label>
            </div>
            
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 px-4 border-[#E5E5E5] text-[#333333] hover:bg-[#F5F5F5] hover:text-[#333333] rounded"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!name.trim() || !condition.length || !actions.length}
                className="h-10 px-4 bg-black text-white hover:opacity-90 rounded"
              >
                {rule ? 'Update Rule' : 'Create Rule'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
