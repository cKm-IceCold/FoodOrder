from rest_framework import serializers
from .models import Order, OrderItem
from food.models import Food

class OrderItemSerializer(serializers.ModelSerializer):
    food_name = serializers.ReadOnlyField(source='food.name')
    
    class Meta:
        model = OrderItem
        fields = ['id', 'food', 'food_name', 'quantity', 'price']
        read_only_fields = ['price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    customer_email = serializers.ReadOnlyField(source='customer.email')

    class Meta:
        model = Order
        fields = ['id', 'customer', 'customer_email', 'items', 'total_price', 'status', 'created_at']
        read_only_fields = ['customer', 'total_price', 'status']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        customer = self.context['request'].user
        
        # Calculate total price and validate availability
        total_price = 0
        order_items = []
        
        for item_data in items_data:
            food = item_data['food']
            if not food.is_available:
                raise serializers.ValidationError(f"Item {food.name} is currently unavailable.")
            
            quantity = item_data['quantity']
            price = food.price
            total_price += price * quantity
            order_items.append(OrderItem(food=food, quantity=quantity, price=price))

        # Create the order
        order = Order.objects.create(customer=customer, total_price=total_price, **validated_data)
        
        # Save order items
        for item in order_items:
            item.order = order
            item.save()
            
        return order
