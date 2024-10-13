# Volunteer Tracking Backend Application

This is a backend application built with Node.js, MongoDB, and JWT, using Mongoose as the ORM. It facilitates easy tracking of volunteers based on events they have attended and provides a role-based privilege system for managing users and data.

## Features

- **Volunteer Tracking**: Enables organizations to easily track volunteers and their participation in events.
- **Volunteer Profiles**: Provides detailed profiles for each volunteer, showcasing personal information and the events they have attended.
- **Event Management**: Displays a list of events with descriptions and details of participants for easy reference.
- **Role-Based Privileges**: Implements role-based access control to manage permissions for different user types (e.g., admin, volunteer).

## Tech Stack

- **Node.js**: Server-side runtime for JavaScript.
- **MongoDB**: NoSQL database used to store volunteer and event data.
- **Mongoose**: ORM for MongoDB to interact with the database efficiently.
- **JWT (JSON Web Tokens)**: Used for authentication and authorization of users.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/ManojithBhat/Volunterring-management-backend
    ```

2. Navigate to the project directory:

    ```bash
    cd Volunterring-management-backend
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables:

    Create a `.env` file in the root directory and add the following:

    ```
    PORT=3000
    MONGO_URI=your_mongo_db_uri
    appName = your_app_name
    CROSS_ORIGIN=*
    ACCESS_TOKEN_SECRET=your_secret_token
    ACCESS_TOKEN_EXPIRY = 1d
    REFRESH_TOKEN_SECRET = your_refrest_token
    REFRESH_TOKEN_EXPIRY = 10d

    ```

5. Start the server:

    ```bash
    npm start
    ```

## API Endpoints

### Authentication

- **POST** `/register` - Register a new user (admin/volunteer).
- **POST** `/login` - Login to obtain a JWT token.
- **POST** `/logout` - Logout the current user (Protected route).
- **POST** `/refresh-token` - Refresh the access token.

### User Management

- **GET** `/user` - Get the current logged-in user's details (Protected route).
- **GET** `/profile` - Get the logged-in user's profile information (Protected route).
- **POST** `/update` - Update the current user's details (Protected route).

### Event Management

- **POST** `/add-event` - Add a new event (Requires admin privileges).
- **POST** `/update-event/:id` - Update an existing event (Requires admin privileges).
- **DELETE** `/delete-event/:id` - Delete an event by its ID (Requires admin privileges).
- **POST** `/add-volunteers/:eventId` - Add volunteers to a specific event (Requires admin privileges).
- **GET** `/events/:eventId` - Get details of a specific event.
- **GET** `/events` - Get a list of all events.

## Role-Based Access

- **Admin**: Full control over the system, including managing volunteers and events.
- **User**: Limited access to view their own profiles and see event information.

## Security

- **JWT Authentication**: Protects routes to ensure only authorized users can access data.
- **Password Hashing**: All user passwords are securely hashed.


