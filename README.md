# Task Manager

## Overview

Task Manager is a simple and efficient application designed to help users manage their tasks. It provides a user-friendly interface for adding, updating, and deleting tasks, and leverages MongoDB for data storage.

## Features

- **User Authentication**: Secure user login and registration.
- **Task Management**: Create, update, and delete tasks.
- **File Uploads**: Support for file uploads using Multer.
- **Data Validation**: Input validation to ensure data integrity.
- **Image Processing**: Use Sharp for image manipulation.

## Tech Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **File Handling**: Multer
- **Image Processing**: Sharp
- **Environment Management**: dotenv
- **Data Validation**: validator

## Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/task-manager.git
    cd task-manager
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up environment variables**:

    Create a `.env` file in the root directory and add the following:

    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4. **Start the server**:

    ```bash
    npm start
    ```

    For development, you can use `nodemon`:

    ```bash
    npm run dev
    ```

## Usage

- **Register a new user**: POST `/api/users/register`
- **Login**: POST `/api/users/login`
- **Create a task**: POST `/api/tasks`
- **Update a task**: PUT `/api/tasks/:id`
- **Delete a task**: DELETE `/api/tasks/:id`
- **Upload a file**: POST `/api/upload`



