# event-managment

A full-featured Event Management System built with React.js, Node.js, Express.js, and MongoDB. This system allows users to create, view, edit, and manage events seamlessly.

## Live Demo Link
Frontend - https://event-managment-jet.vercel.app
backend - https://event-managment-qspc.onrender.com

# Features
 - **User Authentication**: Login and Sign-up functionality.
 - **Event Management**: Users can create, update, delete, and view events.
 - **Responsive UI**: Built with Bootstrap 5 and Material UI to ensure mobile and desktop compatibility.
 - **Event Booking**: Users can view event details and book participation.
 - **Notifications**: Display notifications using **React Toastify**.
 - **Email service**: Confirms a user's event booking using **Nodemailer**.
 - **Image Uploads**: Add images to events.

# Installation
  1. Install dependencies :-
     - Frontend:
         cd frontend
         npm install
     - Backend:
         cd backend
         npm install
  2. Create a .env file in the backend directory with the following environment variables :-
      - MONGODB_URI=<Your MongoDB Connection String>
      - JWT_SECRET=<Your JWT Secret Key>
      - PORT=<Your PORT>
  3. Run the backend :-
      - cd backend
      - npm run dev
  4. Run the frontend:
      - cd frontend
      - npm start
