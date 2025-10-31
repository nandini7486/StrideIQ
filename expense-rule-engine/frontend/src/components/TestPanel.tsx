import { useState } from 'react';
import { useRules } from '@/context/RuleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const defaultExpense = {
  expense_id: `exp_${Math.floor(1000 + Math.random() * 9000)}`,
  amount: '350',
  category: 'Food',
  working_hours: '13',
  employee_id: 'u_123',
  dateTime: new Date().toISOString().slice(0, 16)
};

const categories = [
  'Food',
  'Travel',
  'Office Supplies',
  'Entertainment',
  'Accommodation',
  'Transportation'
];

export default function TestPanel() {
  const [expense, setExpense] = useState(defaultExpense);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { evaluateExpense } = useRules();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTest = async () => {
    try {
      setIsLoading(true);
      setResult(null); // Clear previous results
      
      const expenseData = {
        ...expense,
        amount: parseFloat(expense.amount) || 0,
        working_hours: parseFloat(expense.working_hours) || 0,
        submitted_at: new Date(expense.dateTime).toISOString()
      };
      
      console.log('Sending evaluation request:', expenseData);
      
      const evaluation = await evaluateExpense(expenseData);
      console.log('Received evaluation response:', evaluation);
      
      if (!evaluation) {
        throw new Error('No response received from server');
      }
      
      // Ensure the response has the expected structure
      const formattedResult = {
        matched_rules: evaluation.matched_rules || [],
        winning_rule: evaluation.winning_rule || null,
        actions: evaluation.actions || [],
        trace: evaluation.trace || []
      };
      
      setResult(formattedResult);
    } catch (err) {
      console.error('Error evaluating expense:', err);
      // Set a user-friendly error message
      setResult({
        error: 'Failed to evaluate expense. Please check the console for details.',
        matched_rules: [],
        winning_rule: null,
        actions: [],
        trace: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 space-y-4 flex-1 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <Label htmlFor="expense-id" className="text-sm font-medium text-[#666666]">Expense ID</Label>
            <Input
              id="expense-id"
              name="expense_id"
              value={expense.expense_id}
              onChange={handleInputChange}
              className="mt-2 h-10 border-[#E5E5E5] focus:border-black focus:ring-black rounded"
              placeholder="exp_123"
            />
          </div>
          
          <div>
            <Label htmlFor="amount" className="text-sm font-medium text-[#666666]">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              name="amount"
              value={expense.amount}
              onChange={handleInputChange}
              className="mt-2 h-10 border-[#E5E5E5] focus:border-black focus:ring-black rounded"
              placeholder="0.00"
            />
          </div>
          
          <div>
            <Label htmlFor="category" className="text-sm font-medium text-[#666666]">Category</Label>
            <Select 
              name="category"
              value={expense.category}
              onValueChange={(value) => setExpense(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="mt-2 h-10 border-[#E5E5E5] focus:border-black focus:ring-black rounded">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="working-hours" className="text-sm font-medium text-[#666666]">Working Hours</Label>
            <Input
              id="working-hours"
              type="number"
              name="working_hours"
              value={expense.working_hours}
              onChange={handleInputChange}
              className="mt-2 h-10 border-[#E5E5E5] focus:border-black focus:ring-black rounded"
              placeholder="0"
            />
          </div>
          
          <div>
            <Label htmlFor="employee-id" className="text-sm font-medium text-[#666666]">Employee ID</Label>
            <Input
              id="employee-id"
              name="employee_id"
              value={expense.employee_id}
              onChange={handleInputChange}
              className="mt-2 h-10 border-[#E5E5E5] focus:border-black focus:ring-black rounded"
              placeholder="emp_123"
            />
          </div>
          
          <div>
            <Label htmlFor="date-time" className="text-sm font-medium text-[#666666]">Date/Time</Label>
            <Input
              id="date-time"
              type="datetime-local"
              name="dateTime"
              value={expense.dateTime}
              onChange={handleInputChange}
              className="mt-2 h-10 border-[#E5E5E5] focus:border-black focus:ring-black rounded"
            />
          </div>
        </div>
        
        <Button 
          onClick={handleTest} 
          disabled={isLoading}
          className="w-full mt-6 bg-black text-white hover:opacity-90 rounded h-10 font-medium"
        >
          {isLoading ? 'Evaluating...' : 'Evaluate Expense'}
        </Button>
        
        {result && (
          <div className="mt-6">
            <div className="border-t border-[#E5E5E5] pt-4">
              <h3 className="text-xs font-medium text-black uppercase mb-4">
                {result.error ? 'Evaluation Error' : 'Evaluation Result'}
              </h3>
              
              {result.error ? (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {result.error}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center text-sm font-medium text-black mb-1">
                      ✓ Matched Rules ({result.matched_rules?.length || 0})
                    </div>
                    {result.matched_rules?.length > 0 ? (
                      <ul className="ml-6 space-y-1">
                        {result.matched_rules.map((rule: string, index: number) => (
                          <li key={index} className="text-sm text-[#666666]">• {rule}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-[#999999] ml-6">No matching rules found for this expense.</p>
                    )}
                  </div>
                  
                  {result.winning_rule && (
                    <div>
                      <div className="flex items-center text-sm font-medium text-black mb-1">
                        🏆 Winning Rule
                      </div>
                      <div className="ml-6 p-3 bg-green-50 rounded border border-green-100">
                        <p className="text-sm text-green-800 font-medium">{result.winning_rule}</p>
                      </div>
                    </div>
                  )}
                  
                  {result.actions && result.actions.length > 0 && (
                    <div>
                      <div className="flex items-center text-sm font-medium text-black mb-1">
                        ⚡ Actions to Take
                      </div>
                      <ul className="ml-6 space-y-2">
                        {result.actions.map((action: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 h-5 flex items-center">
                              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                            <span className="ml-2 text-sm text-gray-900">
                              {action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {result.trace && result.trace.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-sm font-medium text-black mb-2">
                        <span>🔍 Evaluation Trace</span>
                        <span className="text-xs text-gray-500">{result.trace.length} steps</span>
                      </div>
                      <div className="bg-[#F8FAFC] p-3 rounded border border-[#E5E5E5] max-h-60 overflow-y-auto">
                        <ul className="space-y-3">
                          {result.trace.map((traceItem: any, index: number) => (
                            <li key={index} className="text-sm">
                              <div className="flex">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  traceItem.matched ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {traceItem.matched ? 'MATCHED' : 'SKIPPED'}
                                </span>
                                <span className="ml-2 font-medium text-gray-900">
                                  {traceItem.rule}
                                </span>
                              </div>
                              {traceItem.reason && (
                                <p className="mt-1 ml-6 text-gray-600">
                                  {traceItem.reason}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
