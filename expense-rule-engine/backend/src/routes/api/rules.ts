import express from 'express';
import { 
  getAllRules, 
  getRuleById, 
  addRule, 
  updateRule, 
  deleteRule, 
  reorderRules 
} from '../../services/rulesService';
import { Rule } from '../../types';

const router = express.Router();

// Get all rules
router.get('/', (_, res) => {
  try {
    const rules = getAllRules();
    return res.json(rules);
  } catch (error) {
    console.error('Error getting rules:', error);
    return res.status(500).json({ error: 'Failed to get rules' });
  }
});

// Get a specific rule
router.get('/:id', (req, res) => {
  try {
    const rule = getRuleById(req.params.id);
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    return res.json(rule);
  } catch (error) {
    console.error('Error getting rule:', error);
    return res.status(500).json({ error: 'Failed to get rule' });
  }
});

// Create a new rule
router.post('/', (req, res) => {
  try {
    const newRule = req.body as Omit<Rule, 'id'>;
    const createdRule = addRule(newRule);
    return res.status(201).json(createdRule);
  } catch (error) {
    console.error('Error creating rule:', error);
    return res.status(500).json({ error: 'Failed to create rule' });
  }
});

// Update a rule
router.put('/:id', (req, res) => {
  try {
    const updatedRule = updateRule(req.params.id, req.body);
    if (!updatedRule) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    return res.json(updatedRule);
  } catch (error) {
    console.error('Error updating rule:', error);
    return res.status(500).json({ error: 'Failed to update rule' });
  }
});

// Delete a rule
router.delete('/:id', (req, res) => {
  try {
    const deleted = deleteRule(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting rule:', error);
    return res.status(500).json({ error: 'Failed to delete rule' });
  }
});

// Reorder rules
router.post('/reorder', (req, res) => {
  try {
    const { ruleIds } = req.body as { ruleIds: string[] };
    const success = reorderRules(ruleIds);
    if (!success) {
      throw new Error('Failed to reorder rules');
    }
    return res.status(200).json({ message: 'Rules reordered successfully' });
  } catch (error) {
    console.error('Error reordering rules:', error);
    return res.status(500).json({ error: 'Failed to reorder rules' });
  }
});

export default router;
