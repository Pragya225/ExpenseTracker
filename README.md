# 💸 SpendSmart — Smart Expense Tracker

A modern, **Expense Tracker Web App** built with React.js. Designed with a fintech-inspired UI featuring glassmorphism cards, smooth animations, dark/light mode, and a full analytics dashboard.

> Built using — Context API, custom hooks, memoization, protected routing, and localStorage persistence.

---

## 📸 Screenshots

### Dashboard
<img width="1908" height="877" alt="image" src="https://github.com/user-attachments/assets/8638fde1-5ebd-446a-83de-36c36902b760" />

### Transactions Page
<img width="1903" height="862" alt="image" src="https://github.com/user-attachments/assets/393f8153-7aad-4610-9c17-6d8089b22b1e" />


### Analytics Dashboard
<img width="1862" height="863" alt="image" src="https://github.com/user-attachments/assets/eb85c8c7-11e3-4457-ab26-de8a1e0b964e" />


### Budget Tracker
<img width="1887" height="840" alt="image" src="https://github.com/user-attachments/assets/1fa65550-e407-4edb-80d9-e5be99e52ae6" />

---

## ✨ Features
 
- 🔐 **Authentication UI** — Login & Signup with form validation and protected routes
- 📊 **Dashboard** — Balance, income, expenses, savings rate at a glance
- 💳 **Transaction Management** — Add, edit, delete income & expenses with categories
- 🔍 **Search, Filter & Sort** — Full control over transaction history
- 📈 **Analytics** — Monthly bar chart, category pie chart, balance trend line
- 🎯 **Budget Manager** — Set monthly budget, progress bar, over-budget alerts
- 🌙 **Dark / Light Mode** — Theme toggle with localStorage persistence
- 📥 **CSV Export** — Download filtered transactions instantly
- 🔔 **Toast Notifications** — Success/error feedback on every action
- 📱 **Fully Responsive** — Mobile + desktop layout with collapsible sidebar
---
 
## 🛠️ Tech Stack
 
| Technology | Usage |
|---|---|
| **React 18** | Functional components, Hooks |
| **React Router v6** | Client-side routing, protected routes |
| **Context API** | Global state management |
| **Recharts** | Bar, Pie, Area charts |
| **Vite** | Build tool & dev server |
| **Plain CSS** | Custom design system with CSS variables |
| **localStorage** | Data persistence across sessions |
| **uuid** | Unique transaction IDs |
 
---
 
## 📁 Project Structure
 
```
src/
├── main.jsx
├── App.jsx                        # Routes + Context Providers
│
├── context/
│   ├── AuthContext.jsx            # Login, signup, logout state
│   ├── TransactionContext.jsx     # Transactions + computed values
│   ├── ThemeContext.jsx           # Dark/Light mode
│   └── ToastContext.jsx           # Global toast notifications
│
├── pages/
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── DashboardPage.jsx
│   ├── TransactionsPage.jsx
│   ├── AnalyticsPage.jsx
│   └── BudgetPage.jsx
│
├── components/
│   ├── Layout/
│   │   ├── AppLayout.jsx          # Sidebar + Topbar shell
│   │   ├── Sidebar.jsx
│   │   └── Topbar.jsx
│   └── Transactions/
│       └── TransactionModal.jsx   # Add / Edit modal
│
└── styles/
    ├── global.css                 # CSS variables & design tokens
    ├── layout.css
    ├── auth.css
    ├── dashboard.css
    ├── transactions.css
    ├── analytics.css
    ├── budget.css
    ├── modal.css
    └── toast.css
```
 
---
 
## 🚀 Getting Started
 
### Prerequisites
 
- Node.js v18+
- npm v9+
### Installation
 
```bash
# 1. Clone the repository
git clone https://github.com/your-username/expense-tracker.git
 
# 2. Move into the project folder
cd expense-tracker
 
# 3. Install dependencies
npm install
 
# 4. Start the development server
npm run dev
```
 
Open [http://localhost:5173](http://localhost:5173) in your browser.
 
---
 
## 🔑 Demo Account
 
You can use the built-in demo account to explore the app instantly:
 
```
Email:    demo@spendsmart.com
Password: demo1234
```
 
Or click the **"Use Demo Account"** button on the login page.
 
---
 
## 💾 How Data is Stored
 
All data is stored in the browser's **localStorage**.
 
| localStorage Key | Data |
|---|---|
| `ss_users` | All registered users (array) |
| `ss_user` | Current logged-in session |
| `ss_tx_{userId}` | Transactions per user |
| `ss_budget_{userId}` | Budget settings per user |
| `ss_theme` | Dark / Light mode preference |
 
> Data persists across page refreshes and logouts. It clears only if you clear browser storage manually.
 
 
## 🙋‍♂️ Author
 
**Pragya**
- GitHub: (https://github.com/Pragya225)
- LinkedIn: ([https://www.linkedin.com/in/pragya-tyagi-b22581338])
---
