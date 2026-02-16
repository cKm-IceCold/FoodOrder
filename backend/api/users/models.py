from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

# 1. THE MANAGER (Handles user creation logic)
# A custom manager is required when you change the USERNAME_FIELD from 'username' to 'email'.
class CustomUserManager(BaseUserManager):
  def create_user(self, email, phone_number, password=None, **extra_fields):
    if not email and not phone_number:
      raise ValueError('The Email and Phone Number fields must be set')
    
    email = self.normalize_email(email) if email else None
    user = self.model(email=email, phone_number=phone_number, **extra_fields)
    user.set_password(password)
    user.save(using=self._db)
    return user
  
  def create_user(self, email=None, phone_number=None, password=None, **extra_fields):
    extra_fields.setdefault('is_staff', False)
    extra_fields.setdefault('is_superuser', False)
    return self.create_user(email, phone_number, password, **extra_fields)
  
  def create_superuser(self, email=None, phone_number=None, password=None, **extra_fields):
    extra_fields.setdefault('is_staff', True)
    extra_fields.setdefault('is_superuser', True)
    return self.create_user(email, phone_number, password, **extra_fields)
  
# 2. THE MODEL (Defines the user fields and behavior)
class CustomUser(AbstractUser):
  username = None
  email = models.EmailField(unique=True)
  phone_number = models.CharField(max_length=15, unique=True)
  USERNAME_FIELD = 'email'  # Use email as the unique identifier
  REQUIRED_FIELDS = [] 

  objects = CustomUserManager()  # Use the custom manager

  def __str__(self):
    return self.email or self.phone_number



