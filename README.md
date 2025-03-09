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

Create, edit, and delete users
Track expenses by user and category
View analytics on spending patterns

The app is built using:

React with hooks for the UI
React Context API for state management
React Router for navigation
Tailwind CSS for styling
Vite for fast development and building

## Tradeoffs and Considerations

State Management: I used Context API instead of Redux for simplicity and to keep the bundle size small, but this might be less ideal for very large applications.
Performance: For large datasets, the app uses pagination and memoization, but for truly massive data, a server-side approach would be better.
Data Persistence: The app currently stores data in memory, which means data is lost on refresh. A real app would use localStorage or a backend.
UI Design: I prioritized functionality and clean design over complex UI effects to keep the app responsive and straightforward.
Form Validation: I implemented simple client-side validation, but a production app might need more robust validation strategies.
