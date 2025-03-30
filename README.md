# Review Nest

A full-stack web application for sharing and managing reviews on various products, built with the MERN stack and deployed on AWS.

## Features

 **User Authentication**  
- Secure login and registration system

 **CRUD Operations**  
- Create, Read, Update, and Delete reviews
- Intuitive review management interface

 **Responsive Design**  
- Optimized for both desktop and mobile devices

 **Performance & Scalability**  
- Cloud-hosted MongoDB database
- Efficient API design

## Tech Stack

### Frontend
- React.js
- React Router
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB (MongoDB Atlas)

### Infrastructure
- **Hosting**: AWS EC2
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions + AWS

## Installation & Setup

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or MongoDB Atlas)
- Git

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/review-nest.git
   cd review-nest
2. Install dependencies for both frontend and backend:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
4. Set up environment variables:

    Create .env files in both server and client directories

    Sample variables are provided in .env.example files

5. Start the development servers:
   ```bash

    # From project root
    cd server && npm run dev & cd ../client && npm start

7. The app should now be running on http://localhost:3000 with the backend on http://localhost:5001.
   Deployment

   The production version is deployed on AWS EC2 with:
 
    Nginx as reverse proxy

    PM2 for process management

    Automated CI/CD pipeline via GitHub Actions
