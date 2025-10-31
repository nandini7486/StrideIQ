import express from 'express';
import rulesRouter from './api/rules';
import evaluateRouter from './api/evaluate';

const router = express.Router();

// API Routes
router.use('/rules', rulesRouter);
router.use('/evaluate', evaluateRouter);

export { router };
