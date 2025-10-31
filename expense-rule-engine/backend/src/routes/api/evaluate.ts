import express from 'express';
import { evaluateExpense } from '../../services/rulesService';

export interface Expense {
  expense_id: string;
  amount: number;
  category: string;
  working_hours?: number;
  employee_id: string;
  submitted_at: string;
  [key: string]: any; // For any additional fields
}

const router = express.Router();

// Evaluate an expense against all rules
router.post('/', (req, res) => {
  try {
    const expense = req.body as Expense;
    
    if (!expense || typeof expense !== 'object') {
      return res.status(400).json({ error: 'Invalid expense data' });
    }

    const result = evaluateExpense(expense);
    return res.json(result);
  } catch (error) {
    console.error('Error evaluating expense:', error);
    return res.status(500).json({ 
      error: 'Failed to evaluate expense',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
