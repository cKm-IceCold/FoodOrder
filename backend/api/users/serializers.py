from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
import random
import string
import datetime

User = get_user_model()

class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    referred_by_code = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = User
        fields = ['email', 'phone_number', 'password', 'referred_by_code']

    def validate(self, data):
        email = data.get('email')
        phone_number = data.get('phone_number')

        if not email and not phone_number:
            raise serializers.ValidationError("Email or Phone Number is required")
        
        return data

    def create(self, validated_data):
        referred_by_code = validated_data.pop('referred_by_code', None)
        referred_by = None

        if referred_by_code:
            try:
                referred_by = User.objects.get(referral_code=referred_by_code)
            except User.DoesNotExist:
                raise serializers.ValidationError({"referred_by_code": "Invalid referral code"})

        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Set additional fields
        user.role = 'customer'
        user.is_verified = False
        
        # Generate OTP
        user.otp = str(random.randint(100000, 999999))
        user.otp_expires_at = timezone.now() + datetime.timedelta(minutes=10)
        
        # Generate Referral Code
        user.referral_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        
        if referred_by:
            user.referred_by = referred_by
            
        user.save()

        # Mock OTP Send
        print(f"[MOCK OTP SERVICE] Sending OTP {user.otp} to {user.email or user.phone_number}")
        
        return user

class VerifyOTPSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        try:
            user = User.objects.get(pk=data['user_id'])
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")

        if user.otp != data['otp']:
            raise serializers.ValidationError("Invalid OTP")

        if user.otp_expires_at < timezone.now():
            raise serializers.ValidationError("OTP has expired")

        return data
