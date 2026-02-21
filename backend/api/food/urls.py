from django.urls import path
from .views import FoodListCreateView

urlpatterns = [
    path('', FoodListCreateView.as_view(), name='food-list-create'),
]
