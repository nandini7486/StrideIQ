import { useState } from 'react';
import { useRules } from '@/context/RuleContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const defaultExpense = `{
  "expense_id": "exp_1",
  "amount": 350,
  "category": "Food",
  "working_hours": 13,
  "employee_id": "u_123",
  "submitted_at": "2025-10-25T21:00:00Z"
}`;

interface TestPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TestPanel({ open, onOpenChange }: TestPanelProps) {
  const [expenseJson, setExpenseJson] = useState(defaultExpense);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { evaluateExpense } = useRules();

  const handleTest = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const expense = JSON.parse(expenseJson);
      const evaluation = await evaluateExpense(expense);
      setResult(evaluation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON or evaluation error');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(expenseJson);
      setExpenseJson(JSON.stringify(parsed, null, 2));
    } catch (e) {
      // Invalid JSON, don't format
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Test Rules</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
          <div className="space-y-4 flex flex-col h-full">
            <div>
              <Label htmlFor="expense-json">Expense JSON</Label>
              <Textarea
                id="expense-json"
                value={expenseJson}
                onChange={(e) => setExpenseJson(e.target.value)}
                onBlur={formatJson}
                className="h-64 font-mono text-sm"
                placeholder="Paste your expense JSON here..."
              />
            </div>
            
            <div className="mt-auto">
              <Button 
                onClick={handleTest} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Testing...' : 'Run Evaluation'}
              </Button>
            </div>
          </div>
          
          <div className="space-y-4 overflow-y-auto pr-2">
            <h3 className="font-medium">Results</h3>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {result && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Matched Rules</span>
                      <div className="space-x-1">
                        {result.matched_rules.length > 0 ? (
                          result.matched_rules.map((rule: string) => (
                            <Badge key={rule} variant="secondary" className="mr-1">
                              {rule}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm">None</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Winning Rule</span>
                      <span className="text-sm font-medium">
                        {result.winning_rule || 'None'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Actions</span>
                      <div className="space-x-1">
                        {result.actions.length > 0 ? (
                          result.actions.map((action: string) => (
                            <Badge 
                              key={action} 
                              variant={action === 'reject' ? 'destructive' : 'secondary'}
                            >
                              {action.replace('_', ' ')}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm">None</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Evaluation Trace</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.trace && result.trace.length > 0 ? (
                      <div className="space-y-2">
                        {result.trace.map((item: any, index: number) => (
                          <div 
                            key={index} 
                            className="flex items-start space-x-2 p-2 rounded-md bg-muted/30"
                          >
                            {item.matched ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-4 w-4 text-muted-foreground/70 mt-0.5 flex-shrink-0" />
                            )}
                            <div>
                              <div className="font-medium">{item.rule}</div>
                              <div className="text-sm text-muted-foreground">{item.reason}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No trace information available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            
            {!result && !error && (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <Terminal className="h-8 w-8 mb-2 opacity-50" />
                <p>Run a test to see the evaluation results</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
