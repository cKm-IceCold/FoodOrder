from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class EmailOrPhoneBackend(BaseBackend):
  """
  Authenticate using either email or phone number.
  """
  def authenticate(self, request, username=None, password=None, **kwargs):
    try:
      # Try to find the user by email
     if '@' in username:
        user = UserModel.objects.get(email=username)
     else:
        user = UserModel.objects.get(phone_number=username)
    except UserModel.DoesNotExist:
      return None
    
    if user.check_password(password) and self.user_can_authenticate(user):
      return user
    
    return None
  
  def user_can_authenticate(self, user):
    return user.is_active

  def get_user(self, user_id):
    try:
      return UserModel.objects.get(pk=user_id)
    except UserModel.DoesNotExist:
      return None

