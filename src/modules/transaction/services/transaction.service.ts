import { EntityManager } from 'typeorm';
import { User } from '../../../data/entities/user.entity';
import { Transaction } from '../../../data/entities/transaction.entity';
import { AppDataSource } from '../../../data/data-source';

const userRepository = AppDataSource.getRepository(User);
const transactionRepository = AppDataSource.getRepository(Transaction);

export class TransactionService {
  async createTransaction(
    senderId: string,
    receiverAccountNumber: string,
    amount: number,
    description?: string,
  ) {
    if (amount <= 0) throw new Error('Amount must be positive');

    const sender = await userRepository.findOne({ where: { id: senderId } });
    if (!sender) throw new Error('Sender not found');

    console.log('Transaction attempt:');
    console.log('- Sender ID:', senderId);
    console.log('- Sender balance:', sender.balance);
    console.log('- Requested amount:', amount);
    console.log('- Receiver account:', receiverAccountNumber);

    if (sender.balance < amount) {
      throw new Error(
        `Insufficient funds. Current balance: $${sender.balance}, Required: $${amount}`,
      );
    }

    const receiver = await userRepository.findOne({
      where: { accountNumber: receiverAccountNumber },
    });
    if (!receiver) throw new Error('Receiver not found');
    if (sender.id === receiver.id)
      throw new Error('Cannot transfer to yourself');

    await AppDataSource.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        sender.balance = parseFloat((sender.balance - amount).toFixed(2));
        await transactionalEntityManager.save(sender);
        receiver.balance = parseFloat((receiver.balance + amount).toFixed(2));
        await transactionalEntityManager.save(receiver);
        const transaction = transactionRepository.create({
          sender,
          receiver,
          amount,
          description,
        });
        await transactionalEntityManager.save(transaction);
      },
    );

    const transaction = await transactionRepository.findOne({
      where: { sender: { id: senderId } },
      order: { transactionDate: 'DESC' },
      relations: ['receiver'],
    });
    return transaction;
  }

  async getUserTransactions(userId: string) {
    return await transactionRepository.find({
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
      relations: ['sender', 'receiver'],
      order: { transactionDate: 'DESC' },
    });
  }

  async getTransactionById(userId: string, transactionId: string) {
    return await transactionRepository.findOne({
      where: [
        { id: transactionId, sender: { id: userId } },
        { id: transactionId, receiver: { id: userId } },
      ],
      relations: ['sender', 'receiver'],
    });
  }
}
