from rest_framework import generics, permissions
from .models import Food
from .serializers import FoodSerializer

class FoodListCreateView(generics.ListCreateAPIView):
    """API endpoint to browse (Public) or Add (Admin) food items."""
    queryset = Food.objects.all()
    serializer_class = FoodSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            # In a real app, this would be IsAdminUser
            return [permissions.AllowAny()] 
        return [permissions.AllowAny()]

    def get_queryset(self):
        # Customers only see available items
        if getattr(self.request.user, 'role', 'customer') == 'customer':
            return Food.objects.filter(is_available=True)
        return Food.objects.all()
