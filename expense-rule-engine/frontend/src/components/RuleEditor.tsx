import { useState, useEffect } from 'react';
import { useRules } from '@/context/RuleContext';
import { type Rule, type Condition, FIELDS, OPERATORS, ACTIONS, type Action } from '@/types/rule';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

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
  const [actions, setActions] = useState<Action[]>([]);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (rule) {
      setName(rule.name);
      setActive(rule.active);
      setActions(rule.actions as Action[]);
      
      // Parse condition string into condition objects
      // This is a simplified parser - in a real app, you'd want a more robust solution
      try {
        const conditions: Condition[] = [];
        const parts = rule.condition.split('&&').map(part => part.trim());
        
        for (const part of parts) {
          for (const op of OPERATORS) {
            if (part.includes(op)) {
              const [left, right] = part.split(op).map(s => s.trim());
              if (FIELDS.includes(left as any)) {
                conditions.push({
                  field: left as any,
                  operator: op,
                  value: right.replace(/['"]/g, '')
                });
                break;
              }
            }
          }
        }
        
        if (conditions.length > 0) {
          setCondition(conditions);
        }
      } catch (e) {
        console.error('Error parsing condition:', e);
        setCondition([{ field: 'amount', operator: '>', value: '' }]);
      }
    } else {
      // Reset form for new rule
      setName('');
      setCondition([{ field: 'amount', operator: '>', value: '' }]);
      setActions([]);
      setActive(true);
    }
  }, [rule, open]);

  const handleAddCondition = () => {
    setCondition([...condition, { field: 'amount', operator: '>', value: '' }]);
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = [...condition];
    newConditions.splice(index, 1);
    setCondition(newConditions);
  };

  const updateCondition = (index: number, field: keyof Condition, value: any) => {
    const newConditions = [...condition];
    (newConditions[index] as any)[field] = value;
    setCondition(newConditions);
  };

  const toggleAction = (action: Action) => {
    setActions(prev => 
      prev.includes(action)
        ? prev.filter(a => a !== action)
        : [...prev, action]
    );
  };

  const generateConditionString = () => {
    return condition
      .map(c => {
        const value = typeof c.value === 'string' && c.field !== 'amount' && c.field !== 'working_hours'
          ? `'${c.value}'`
          : c.value;
        return `${c.field} ${c.operator} ${value}`;
      })
      .join(' && ');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ruleData = {
      name,
      condition: generateConditionString(),
      actions,
      active,
    };

    if (rule) {
      updateRule(rule.id, ruleData);
    } else {
      addRule(ruleData as Rule);
    }
    
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{rule ? 'Edit Rule' : 'Create New Rule'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Rule Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., High Expense Check"
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Conditions</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCondition}
              >
                Add Condition
              </Button>
            </div>
            
            <div className="space-y-3">
              {condition.map((cond, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Select
                    value={cond.field}
                    onValueChange={(value) => updateCondition(index, 'field', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Field" />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELDS.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={cond.operator}
                    onValueChange={(value) => updateCondition(index, 'operator', value)}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {OPERATORS.map((op) => (
                        <SelectItem key={op} value={op}>
                          {op}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    className="flex-1"
                    value={cond.value}
                    onChange={(e) => updateCondition(index, 'value', e.target.value)}
                    placeholder="Value"
                    type={cond.field === 'amount' || cond.field === 'working_hours' ? 'number' : 'text'}
                    required
                  />

                  {condition.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCondition(index)}
                      className="text-destructive"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <div className="text-sm font-medium mb-2">Preview:</div>
              <div className="bg-muted p-3 rounded-md text-sm font-mono">
                {generateConditionString() || 'No conditions defined'}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Actions</Label>
            <div className="grid grid-cols-2 gap-2">
              {ACTIONS.map((action) => (
                <div key={action} className="flex items-center space-x-2">
                  <Checkbox
                    id={`action-${action}`}
                    checked={actions.includes(action)}
                    onCheckedChange={() => toggleAction(action)}
                  />
                  <Label htmlFor={`action-${action}`} className="capitalize">
                    {action.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={active}
              onCheckedChange={(checked) => setActive(checked as boolean)}
            />
            <Label htmlFor="active">Active</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {rule ? 'Update Rule' : 'Create Rule'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
