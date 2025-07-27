# Modern Todo App

A beautiful, full-stack ready React application for managing todos with authentication. Built with modern UI components, smooth animations, and a clean architecture that's ready for backend integration.

## ✨ Features

### 🔐 Authentication
- **Login & Signup Pages**: Beautiful split-screen design with form validation
- **Protected Routes**: Secure access to todo features
- **Context-based State Management**: Clean authentication state handling
- **Responsive Design**: Mobile-first approach with elegant layouts

### 📝 Todo Management
- **CRUD Operations**: Create, read, update, and delete todos
- **Real-time Updates**: Smooth animations and instant feedback
- **Filtering**: View all, active, or completed todos
- **Statistics Dashboard**: Visual overview of task progress
- **Card-based Design**: Modern, clean interface with hover effects

### 🎨 Design & UX
- **Modern UI Components**: Custom-built with TailwindCSS
- **Smooth Animations**: Transitions and micro-interactions throughout
- **Professional Color Palette**: Blue primary, emerald accents
- **Mobile Responsive**: Optimized for all screen sizes
- **Loading States**: Elegant loading indicators and states

### 🏗️ Architecture
- **Component-based Structure**: Modular, reusable components
- **TypeScript**: Full type safety throughout the application
- **Mock API Layer**: Ready for backend integration
- **Clean Code Organization**: Well-structured folders and files

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone and setup** (if you haven't already):
   ```bash
   git clone <your-repo-url>
   cd todo-app
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to the local development URL (typically `http://localhost:5173`)

### Usage

1. **Sign Up**: Create a new account or use the login page
2. **Add Todos**: Click "Add New Todo" to create tasks
3. **Manage Tasks**: Edit, complete, or delete todos as needed
4. **Filter Views**: Switch between All, Active, and Completed todos
5. **Track Progress**: View your task statistics in the dashboard

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (Button, Input, Card)
│   ├── layout/          # Layout components (Header)
│   ├── todo/            # Todo-specific components
│   └── ProtectedRoute.tsx
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication state management
├── pages/               # Page components
│   ├── LoginPage.tsx    # Authentication pages
│   ├── SignupPage.tsx
│   └── TodoPage.tsx     # Main todo interface
├── services/            # API layer
│   └── api.ts           # Mock API functions
└── App.tsx              # Main app component with routing
```

## 🔧 Backend Integration

The app is designed for easy backend integration:

### API Endpoints to Implement

**Authentication:**
```typescript
POST /api/auth/login      // Login user
POST /api/auth/signup     // Register new user
POST /api/auth/logout     // Logout user
GET  /api/auth/me         // Get current user
```

**Todos:**
```typescript
GET    /api/todos         // Fetch user todos
POST   /api/todos         // Create new todo
PUT    /api/todos/:id     // Update todo
DELETE /api/todos/:id     // Delete todo
```

### Integration Steps

1. **Replace Mock API**: Update `src/services/api.ts` with real API calls
2. **Add Environment Variables**: Create `.env` file with API URL
3. **Update Auth Context**: Modify authentication flow for real tokens
4. **Add Error Handling**: Implement proper error boundaries and notifications

### Example Backend Integration

```typescript
// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const todoAPI = {
  getTodos: async (): Promise<Todo[]> => {
    const response = await fetch(`${API_URL}/todos`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },
  // ... other methods
};
```

## 🎨 Customization

### Colors
The app uses a professional color palette defined in TailwindCSS:
- **Primary**: Blue (#3B82F6)
- **Secondary**: Emerald (#10B981)
- **Accent**: Orange (#F97316)
- **Success/Warning/Error**: Standard semantic colors

### Components
All components are built with customization in mind:
- Modify `src/components/ui/` for basic component styling
- Update `tailwind.config.js` for theme customization
- Components accept className props for easy styling overrides

## 📱 Mobile Responsiveness

The app is fully responsive with:
- Mobile-first design approach
- Optimized layouts for all screen sizes
- Touch-friendly interactions
- Responsive typography and spacing

## 🔒 Security Considerations

When integrating with a backend:
- Implement proper JWT token handling
- Add CSRF protection
- Sanitize user inputs
- Use HTTPS in production
- Implement rate limiting

## 📦 Production Build

```bash
npm run build
```

The build files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🧪 Testing

This project includes a comprehensive Cypress test suite for end-to-end UI testing.

### Running Tests

**Interactive Mode (Cypress Test Runner):**
```bash
# Start the development server first
npm run dev

# In another terminal, open Cypress Test Runner
npm run cypress:open
# or
npx cypress open
```

**Headless Mode (CI/CD):**
```bash
# Start the development server first
npm run dev

# In another terminal, run tests headlessly
npm run cypress:run
# or
npx cypress run
```

**Quick Test Commands:**
```bash
npm run test:e2e        # Run tests headlessly
npm run test:e2e:open   # Open interactive test runner
```

### Test Coverage

The Cypress test suite covers:

**Authentication Tests:**
- ✅ Login with valid credentials
- ✅ Login with invalid credentials (error handling)
- ✅ Navigation between login/signup pages
- ✅ Signup with valid information
- ✅ Form validation for both login and signup

**Todo Management Tests:**
- ✅ Creating new todo items
- ✅ Editing existing todo items
- ✅ Deleting todo items
- ✅ Toggling todo completion status
- ✅ Filtering todos (All, Active, Completed)
- ✅ Empty state displays
- ✅ Todo form validation

**UI and Navigation Tests:**
- ✅ User information display in header
- ✅ Logout functionality
- ✅ Statistics display and accuracy
- ✅ Responsive design on mobile viewports
- ✅ Loading states and transitions

### Test Structure

```
cypress/
├── e2e/
│   └── ui-tests.cy.js          # Main test suite
├── fixtures/
│   └── example.json            # Test data fixtures
└── support/
    ├── commands.js             # Custom Cypress commands
    └── e2e.js                  # Global test configuration
```

### Custom Commands

The test suite includes custom Cypress commands for common actions:
- `cy.loginWithValidCredentials()` - Quick login helper
- `cy.loginWithInvalidCredentials()` - Test invalid login
- `cy.createTodo(title, description)` - Create todo helper
- `cy.waitForPageLoad()` - Wait for loading states

### Test Best Practices

- **Independent Tests**: Each test is self-contained and doesn't depend on others
- **Clean State**: localStorage is cleared before each test
- **Robust Selectors**: Uses data-testid attributes and semantic selectors
- **Proper Waits**: Includes appropriate waits for async operations
- **Error Scenarios**: Tests both positive and negative paths
- **Mobile Testing**: Includes responsive design validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using React, TypeScript, TailwindCSS, and modern web development practices.**