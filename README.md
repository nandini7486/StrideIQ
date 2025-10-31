# StrideIQ - Expense Rule Engine

A powerful and flexible expense management system with a rule-based engine for automated expense processing and policy enforcement.

![StrideIQ Logo](https://via.placeholder.com/150) <!-- Replace with your actual logo -->

## 🚀 Features

- **Rule Management**: Create, edit, and manage expense processing rules with an intuitive interface
- **Real-time Evaluation**: Test expense rules in real-time with the built-in test panel
- **Drag & Drop Interface**: Easily reorder rules by priority with drag and drop
- **Expense Categorization**: Automatic categorization of expenses based on rules
- **Multi-condition Rules**: Create complex rules with multiple conditions
- **Action System**: Define custom actions for rule matches (approve, flag, reject, etc.)
- **Audit Trail**: Track all rule evaluations and decisions

## 🛠 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- TailwindCSS for styling
- React Beautiful DnD for drag and drop
- React Hook Form for form handling
- Radix UI for accessible components

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- SQLite (can be configured for other databases)

## 📦 Prerequisites

- Node.js 16+ (LTS recommended)
- npm or yarn
- Git

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/strideiq.git
cd strideiq
```

### 2. Set up the Backend
```bash
cd expense-rule-engine/backend
npm install

# Copy .env.example to .env and update the values
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

### 3. Set up the Frontend
```bash
cd ../frontend
npm install

# Copy .env.example to .env and update the values
cp .env.example .env

# Start the development server
npm run dev
```

The application should now be running at `http://localhost:5173`

## 🏗 Project Structure

```
strideiq/
├── expense-rule-engine/
│   ├── backend/           # Backend server code
│   │   ├── prisma/        # Database schema and migrations
│   │   ├── src/           # Source code
│   │   │   ├── routes/    # API routes
│   │   │   ├── services/  # Business logic
│   │   │   └── utils/     # Utility functions
│   │   └── ...
│   │
│   └── frontend/          # Frontend React application
│       ├── public/        # Static files
│       └── src/
│           ├── components/  # Reusable UI components
│           ├── pages/       # Page components
│           ├── context/     # React context providers
│           └── services/    # API services
└── ...
```

## 🔧 Configuration

### Backend Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=8000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_jwt_secret_here"
NODE_ENV="development"
```

### Frontend Environment Variables
Create a `.env` file in the `frontend` directory with:

```env
VITE_API_BASE_URL="http://localhost:8000/api"
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- And all other amazing open-source projects used in this project
