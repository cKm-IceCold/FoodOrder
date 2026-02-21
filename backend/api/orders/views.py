from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer

class OrderCreateView(generics.CreateAPIView):
    """API endpoint for customers to place orders."""
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny()] # Using headless auth headers simulation

    def perform_create(self, serializer):
        # We assume req.user is set (middleware or manual header check)
        # For simplicity in this demo, we'll allow any for now as requested.
        serializer.save()

class OrderDetailView(generics.RetrieveAPIView):
    """API endpoint to fetch order details and status."""
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    lookup_field = 'id'
    permission_classes = [permissions.AllowAny()]
