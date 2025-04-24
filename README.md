# DentoCare - Dental Checkup System

A full-stack web application for managing dental checkups between patients and dentists.

## Features

- User authentication (patients and dentists)
- Patient can request checkups from available dentists
- Dentists can view and manage checkup requests
- Image upload and description for dental checkups
- PDF export of checkup details
- Responsive design for mobile, tablet, and desktop

## Tech Stack

- Frontend: React.js with Tailwind CSS
- Backend: Node.js with Express.js
- Database: MongoDB
- Authentication: JWT
- File Upload: Multer
- PDF Generation: PDFKit

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd dentocare
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
cd client
npm install
```

4. Create a .env file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
```

5. Create an uploads directory in the root folder:
```bash
mkdir uploads
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Usage

1. Register as a patient or dentist
2. Patients can:
   - View available dentists
   - Request checkups
   - View checkup results
   - Export checkup details as PDF

3. Dentists can:
   - View checkup requests
   - Upload images and add descriptions
   - Update checkup status
   - Add notes to checkups

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Users
- GET /api/users/dentists - Get all dentists
- GET /api/users/me - Get current user

### Checkups
- POST /api/checkups - Create new checkup request
- GET /api/checkups/patient - Get patient's checkups
- GET /api/checkups/dentist - Get dentist's checkups
- GET /api/checkups/:id - Get single checkup
- POST /api/checkups/:id/images - Upload checkup images
- PUT /api/checkups/:id - Update checkup
- GET /api/checkups/:id/export - Export checkup as PDF

## Security

- JWT authentication
- Password hashing with bcrypt
- Protected routes
- File upload validation
- Input sanitization

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 
