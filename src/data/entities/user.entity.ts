import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Index,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { generateAccountNumber } from '../../utils/generateAccountNumber';

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  SYSTEM = 'system',
}

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  @Index()
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column({ name: 'account_number', length: 20, unique: true })
  @Index()
  accountNumber: string;

  @Column('decimal', {
    precision: 15,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  balance: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Transaction, (transaction) => transaction.sender)
  sentTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.receiver)
  receivedTransactions: Transaction[];

  @BeforeInsert()
  async beforeInsert() {
    if (!this.accountNumber) {
      this.accountNumber = generateAccountNumber();
    }
    if (this.email) {
      this.email = this.email.toLowerCase();
    }
  }
}
