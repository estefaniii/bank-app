import { Router } from 'express';
import { TransactionController } from '../transaction/transaction.controller';
import { TransactionService } from '../transaction/services/transaction.service';
import { authenticate } from '../../config/middleware/auth.middleware';

export class TransactionRoutes {
  static get routes(): Router {
    const router = Router();
    const transactionService = new TransactionService();
    const controller = new TransactionController(transactionService);
    router.use(authenticate as any);
    router.post('/', controller.create.bind(controller) as any);
    router.get('/', controller.getUserTransactions.bind(controller) as any);
    router.get(
      '/:id',
      controller.getTransactionById.bind(
        controller,
      ) as import('express').RequestHandler,
    );

    return router;
  }
}
