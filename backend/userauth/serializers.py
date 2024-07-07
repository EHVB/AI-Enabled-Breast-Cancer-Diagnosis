# from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer
from userauth.models import User



class CreateUserSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password']