## Expense Tracker Dashboard
A simple expense tracking application built with React and Tailwind CSS.

## How to Run
Clone the repository

Install dependencies:
npm install

Start the development server:
npm run dev

Open http://localhost:5173 in your browser

## Technical Summary
This application allows users to:

1. Create, edit, and delete users
2. Track expenses by user and category
3. View analytics on spending patterns

The app is built using:

1. React with hooks for the UI
2. React Context API for state management
3. React Router for navigation
4. Tailwind CSS for styling
5. Vite for fast development and building

## Tradeoffs and Considerations

State Management: I used Context API instead of Redux for simplicity and to keep the bundle size small, but this might be less ideal for very large applications.

Performance: For large datasets, the app uses pagination and memoization, but for truly massive data, a server-side approach would be better.

Data Persistence: The app currently stores data in memory, which means data is lost on refresh. A real app would use localStorage or a backend.

UI Design: I prioritized functionality and clean design over complex UI effects to keep the app responsive and straightforward.

Form Validation: I implemented simple client-side validation, but a production app might need more robust validation strategies.
