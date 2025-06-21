# 🏦 Bank Database API

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
</div>

A complete TypeScript-based banking API featuring user authentication, account management, and secure financial transactions.

## ✨ Features

- **🔐 Secure Authentication**: JWT-based authentication with role-based access control
- **💰 Transaction Management**: Secure money transfers between accounts with balance validation
- **👥 User Management**: Complete user registration, profile management, and account creation
- **🏛️ Admin System**: Administrative controls for user management and system oversight
- **🔒 Security**: Password hashing, input validation, and transaction protection
- **📊 Database Seeding**: Automatic setup with admin and system accounts

## 🛠️ Technologies Used

- **Backend**: TypeScript, Node.js, Express.js
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **Validation**: Environment variable validation and input sanitization

## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bank-database-api.git
cd bank-database-api
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure your database connection in `.env`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/bank_db
JWT_KEY=your-secret-jwt-key
NODE_ENV=development
```

5. Start the development server:

```bash
npm run start:dev
```

## 🔍 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### Users

- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID (Admin only)

### Transactions

- `POST /api/v1/transactions` - Create transaction
- `GET /api/v1/transactions` - Get user transactions
- `GET /api/v1/transactions/:id` - Get transaction by ID

## 🔍 Code Highlights

```typescript
// Secure transaction creation with balance validation
async createTransaction(
  senderId: string,
  receiverAccountNumber: string,
  amount: number,
  description?: string,
) {
  if (amount <= 0) throw new Error('Amount must be positive');

  const sender = await userRepository.findOne({ where: { id: senderId } });
  if (sender.balance < amount) {
    throw new Error(`Insufficient funds. Current balance: $${sender.balance}, Required: $${amount}`);
  }

  // Transaction with database rollback protection
  await AppDataSource.manager.transaction(async (manager) => {
    sender.balance = parseFloat((sender.balance - amount).toFixed(2));
    await manager.save(sender);
    // ... complete transaction
  });
}
```

```typescript
// JWT Authentication middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, envs.JWT_KEY) as JwtPayload;
  req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
  next();
};
```

## 🗄️ Database Schema

### Users Table

- `id`: Primary key
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `accountNumber`: Unique bank account number
- `balance`: Current account balance
- `role`: User role (ADMIN/CUSTOMER)

### Transactions Table

- `id`: Primary key
- `sender`: Reference to sender user
- `receiver`: Reference to receiver user
- `amount`: Transaction amount
- `description`: Transaction description
- `transactionDate`: Timestamp

## 🤝 How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 🔧 Development

### Available Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_KEY` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)

## 💖 Support My Work

If you find this project useful, consider supporting my development:

[![Support via PayPal](https://img.shields.io/badge/Donate-PayPal-blue?style=for-the-badge&logo=paypal)](https://paypal.me/yourusername)

---

⭐ Feel free to star the repository if you like this project!
