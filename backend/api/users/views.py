from django.shortcuts import render, redirect
from .forms import EmailOrPhoneLoginForm
from django.contrib.auth import authenticate, login
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSignupSerializer, VerifyOTPSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

# Template views (Existing)
def login_view(request):
  if request.method == 'POST':
    form = EmailOrPhoneLoginForm(request.POST)
    if form.is_valid():
       user=form.get_user()
       login(request, user)
       return redirect('home')  # Redirect to a success page.
  else:
    form = EmailOrPhoneLoginForm()
  return render(request, 'login.html', {'form': form})

# API Views (New)
class SignupView(APIView):
    """API endpoint for user registration."""
    def post(self, request):
        serializer = UserSignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User registered. Please verify your account with the OTP sent.",
                "userId": user.id,
                "debug_otp": user.otp 
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    """API endpoint for OTP verification."""
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.get(pk=serializer.validated_data['user_id'])
            user.is_verified = True
            user.otp = None
            user.otp_expires_at = None
            user.save()
            return Response({
                "message": "Account verified successfully!",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "phone": user.phone_number,
                    "role": user.role
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  