from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Book


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            first_name=validated_data["name"],
            password=validated_data["password"],
        )


class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="first_name")
    is_admin = serializers.BooleanField(source="is_staff")

    class Meta:
        model = User
        fields = ["id", "email", "name", "is_admin"]


class AdminUserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="first_name")
    is_admin = serializers.BooleanField(source="is_staff")
    book_count = serializers.IntegerField(source="books.count", read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "name", "is_admin", "is_active", "book_count"]


class BookSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source="owner.email", read_only=True)

    class Meta:
        model = Book
        fields = ["id", "title", "author", "genre", "status", "price", "pages", "owner", "owner_email"]
        read_only_fields = ["owner", "owner_email"]
