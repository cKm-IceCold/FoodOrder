# Food Ordering System API Documentation

Welcome to the Food Ordering System API. This documentation explains how to interact with the backend features.

## Authentication Flow

### 1. Sign Up
- **Endpoint**: `POST /api/auth/signup`
- **Description**: Registers a new user. Users are unverified by default.
- **Request Body**:
  ```json
  {
    "email": "user@example.com", 
    "phone": "1234567890",
    "password": "yourpassword",
    "referredByCode": "REF123" 
  }
  ```
- **Example Success Response (201 Created)**:
  ```json
  {
    "message": "User registered. Please verify your account with the OTP sent.",
    "userId": "65d56f...",
    "debug_otp": "723812"
  }
  ```
- **Example Error Response (400 Bad Request)**:
  ```json
  {
    "message": "Email or phone number already registered"
  }
  ```

### 2. Verify OTP
- **Endpoint**: `POST /api/auth/verify-otp`
- **Description**: Verifies the account using the OTP sent during signup.
- **Request Body**:
  ```json
  {
    "userId": "65d56f...",
    "otp": "723812"
  }
  ```
- **Example Success Response (200 OK)**:
  ```json
  {
    "message": "Account verified successfully! You can now log in.",
    "user": {
        "id": "65d56f...",
        "email": "user@example.com",
        "role": "customer"
    }
  }
  ```

---

## Food Management

### 1. Browse Food
- **Endpoint**: `GET /api/foods`
- **Description**: Returns all available food items.
- **Example Response (200 OK)**:
  ```json
  [
    {
      "_id": "65d57...",
      "name": "Jollof Rice",
      "price": 2500,
      "category": "Main Course",
      "isAvailable": true
    }
  ]
  ```

### 2. Add Food (Admin Only)
- **Endpoint**: `POST /api/foods`
- **Headers**: `{ "x-user-id": "ADMIN_ID" }`
- **Request Body**:
  ```json
  {
    "name": "Jollof Rice",
    "description": "Premium Nigerian Jollof",
    "price": 2500,
    "category": "Main Course"
  }
  ```
- **Example Success Response (201 Created)**:
  ```json
  {
    "message": "Food item added successfully",
    "food": {
        "_id": "65d57...",
        "name": "Jollof Rice",
        "price": 2500
    }
  }
  ```

---

## Order Management

### 1. Place Order (Customer)
- **Endpoint**: `POST /api/orders`
- **Headers**: `{ "x-user-id": "CUSTOMER_ID" }`
- **Description**: Creates an order. Calculates price and validates availability.
- **Request Body**:
  ```json
  {
    "items": [
      { "foodId": "65d57...", "quantity": 2 },
      { "foodId": "65d58...", "quantity": 1 }
    ]
  }
  ```
- **Example Success Response (201 Created)**:
  ```json
  {
    "message": "Order placed successfully! 🏪",
    "order": {
        "_id": "65d59...",
        "totalPrice": 6500,
        "status": "pending"
    }
  }
  ```

### 2. Fetch Order Details
- **Endpoint**: `GET /api/orders/:id`
- **Description**: Get status and item details for a specific order.
- **Access**: Owner or Admin.

### 3. Update Order Status (Admin Only)
- **Endpoint**: `PATCH /api/orders/:id/status`
- **Body**: 
  ```json
  { "status": "preparing" }
  ```
- **Valid Statuses**: `pending`, `confirmed`, `preparing`, `out-for-delivery`, `completed`, `cancelled`.

### 4. Cancel Order (Customer)
- **Endpoint**: `PATCH /api/orders/:id/cancel`
- **Description**: Allowed only if the status is still `pending`.

---

## Technical Explanation for Beginners

1.  **Models**: Blueprints for your data (User, Food, Order).
2.  **Routes**: Open "doors" or pathways (URLs) to your functions.
3.  **Middleware**: Security guards (Checking if you are logged in or an admin).
4.  **Utilities**: Helper tools (Generating random codes).
5.  **App.js**: The brain that connects everything.
