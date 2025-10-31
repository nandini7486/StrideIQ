import { useState } from 'react';
import { Check, Zap, ClipboardList } from 'lucide-react';

interface TestResult {
  matchedRules: string[];
  winningRule: string;
  actions: string[];
  trace: string[];
}

export function TestPanel() {
  const [expense, setExpense] = useState({
    id: '',
    amount: '',
    category: '',
    workingHours: '',
    employeeId: '',
    dateTime: new Date().toISOString().slice(0, 16),
  });

  const [result, setResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock response - replace with actual API call
      setResult({
        matchedRules: [
          'High Amount Check',
          'Overtime Meal Policy'
        ],
        winningRule: 'Overtime Meal Policy',
        actions: ['Flag for review'],
        trace: [
          '1. Rule "r1" matched: amount>200',
          '2. Rule "r2" matched: amount>200 && working_hours>12',
          '3. Higher specificity → r2 wins'
        ]
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Test Expense</h2>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expense ID</label>
            <input
              type="text"
              name="id"
              value={expense.id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Enter expense ID"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={expense.amount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={expense.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black bg-white"
            >
              <option value="">Select a category</option>
              <option value="meals">Meals</option>
              <option value="travel">Travel</option>
              <option value="accommodation">Accommodation</option>
              <option value="entertainment">Entertainment</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours</label>
            <input
              type="number"
              name="workingHours"
              value={expense.workingHours}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Hours worked"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={expense.employeeId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Enter employee ID"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
            <input
              type="datetime-local"
              name="dateTime"
              value={expense.dateTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 flex items-center justify-center"
          >
            {isLoading ? (
              'Evaluating...'
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Evaluate Expense
              </>
            )}
          </button>
        </form>
        
        {result && (
          <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">EVALUATION RESULT</h3>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <div className="flex items-center text-sm font-medium text-gray-900">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Matched Rules ({result.matchedRules.length})
                </div>
                <ul className="mt-1 ml-6 text-sm text-gray-600 list-disc space-y-1">
                  {result.matchedRules.map((rule, index) => (
                    <li key={index}>• {rule}</li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center text-sm font-medium text-gray-900">
                  → Winning Rule
                </div>
                <div className="mt-1 ml-6 text-sm text-gray-600">
                  "{result.winningRule}"
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center text-sm font-medium text-gray-900">
                  <Zap className="w-4 h-4 text-yellow-500 mr-2" />
                  Actions
                </div>
                <ul className="mt-1 ml-6 text-sm text-gray-600 list-disc space-y-1">
                  {result.actions.map((action, index) => (
                    <li key={index}>• {action}</li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center text-sm font-medium text-gray-900">
                  <ClipboardList className="w-4 h-4 text-blue-500 mr-2" />
                  Trace
                </div>
                <div className="mt-1 ml-6">
                  {result.trace.map((step, index) => (
                    <div key={index} className="text-xs text-gray-500 py-1">
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
