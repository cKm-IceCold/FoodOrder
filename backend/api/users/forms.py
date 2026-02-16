from django import forms
from django.contrib.auth import get_user_model

class EmailOrPhoneLoginForm(forms.Form):
  username = forms.CharField(label='Email or Phone Number')
  password = forms.CharField(widget=forms.PasswordInput)