# Food Ordering System - Django API Documentation

This backend is built using Django and Django REST Framework (DRF). It provides the same functionality as the Node.js version.

## Endpoints

### 1. User Signup
- **URL**: `POST /api/auth/signup/`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "phone_number": "1234567890",
    "password": "yourpassword",
    "referred_by_code": "REF123"
  }
  ```
- **Response**: `201 Created` with `userId` and `debug_otp`.

### 2. Verify OTP
- **URL**: `POST /api/auth/verify-otp/`
- **Body**:
  ```json
  {
    "user_id": 1,
    "otp": "123456"
  }
  ```

### 3. Food Menu
- **URL**: `GET /api/foods/` (List available items)
- **URL**: `POST /api/foods/` (Add new item - Admin)

### 4. Orders
- **URL**: `POST /api/orders/` (Place order)
- **URL**: `GET /api/orders/<id>/` (Order details)

## Technical Features
1. **Custom User Model**: Handles both email and phone registration.
2. **DRF Serializers**: Manage complex validation and nested order item creation.
3. **Calculation Logic**: Total price is calculated on the server side to prevent tampering.
4. **Availability Guard**: Prevents ordering items that are marked as unavailable.
