from django.shortcuts import render, redirect
from .forms import EmailOrPhoneLoginForm
from django.contrib.auth import authenticate, login

# Create your views here.
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

  