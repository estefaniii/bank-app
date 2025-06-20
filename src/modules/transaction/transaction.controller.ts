import { Request, Response } from 'express';
import { TransactionService } from '../transaction/services/transaction.service';
import { User } from '../../data/entities/user.entity';

interface CustomRequest extends Request {
  user?: User;
}

export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  async create(req: CustomRequest, res: Response) {
    try {
      const { receiverAccountNumber, amount, description } = req.body;
      const userId = req.user!.id;
      const transaction = await this.transactionService.createTransaction(
        userId,
        receiverAccountNumber,
        amount,
        description,
      );
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getUserTransactions(req: CustomRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const transactions = await this.transactionService.getUserTransactions(
        userId,
      );
      res.status(200).json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTransactionById(req: CustomRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const transactionId = req.params.id;
      const transaction = await this.transactionService.getTransactionById(
        userId,
        transactionId,
      );
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      res.status(200).json(transaction);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
