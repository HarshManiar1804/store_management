## Project Overview

## Demo Video :- https://youtu.be/uR-Dp365ECo?si=7Zf60Tchk16Cj_LI

Store-management is a full-stack application with:

- **Frontend**: React-based UI with modern components and data visualization
- **Backend**: Express.js API server with PostgreSQL database
- **Authentication**: Clerk for user authentication and management

## Features

- **Store Management**: Add, delete, and view store locations with city and state information
- **SKU Management**: Manage product data including classification, department, price, and cost
- **Sales Planning**: Plan sales units for specific store-SKU-week combinations
- **Analytics Dashboard**: Visualize sales metrics, gross margin, and other KPIs
- **Data Filtering**: Filter and search capabilities across all data views

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Radix UI components
- Chart.js for data visualization
- Clerk for authentication

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- TypeScript

## Project Structure

```
store_management-app/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (Store, SKUs, Planning, Charts)
│   │   ├── lib/             # Utility functions and shared code
│   │   └── main.tsx         # Application entry point
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
│
├── backend/                 # Express.js backend API
│   ├── controllers/         # API controllers
│   ├── routes/              # API route definitions
│   ├── config/              # Configuration files
│   ├── prisma/              # Prisma ORM schema and migrations
│   │   └── schema.prisma    # Database schema definition
│   ├── index.js             # Server entry point
│   └── package.json         # Backend dependencies
```

## Database Schema

The application uses the following data models:

- **Store**: Retail store locations with ID, label, city, and state
- **SKUs**: Products with ID, label, class, department, price, and cost
- **Calendar**: Time periods with week and month information
- **Planning**: Sales planning data linking stores, SKUs, and time periods
- **Calculation**: Calculated sales metrics for analysis
- **Chart**: Aggregated data for visualization

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone git@github.com:HarshManiar1804/store_management.git
   cd store_management
   ```

2. Set up the backend:
   ```
   cd backend
   npm install
   ```

3. Configure the database:
   - Create a PostgreSQL database
   - Update the `.env` file with your database connection string
   - Run Prisma migrations:
     ```
     npx prisma migrate dev
     ```

4. Start the backend server:
   ```
   npm run server
   ```

5. Set up the frontend:
   ```
   cd ../frontend
   npm install
   ```

6. Configure the frontend:
   - Update the `.env` file with your Clerk API keys and backend URL

7. Start the frontend development server:
   ```
   npm run dev
   ```

8. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173)

## API Endpoints

The backend provides the following API endpoints:

- **Store API**:
  - GET `/stores` - Get all stores
  - POST `/stores` - Create a new store
  - DELETE `/stores/:id` - Delete a store

- **SKU API**:
  - GET `/skus` - Get all SKUs
  - POST `/skus` - Create a new SKU
  - DELETE `/skus/:id` - Delete a SKU

- **Planning API**:
  - GET `/planning` - Get planning data

