from rest_framework import serializers
from .models import CustomUser, ActivityLog
from django.contrib.auth import authenticate


class CustomUserSerializer(serializers.ModelSerializer):
    total_logins = serializers.SerializerMethodField()
    total_downloads = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'name', 'role', 'total_logins', 'total_downloads']

    def get_total_logins(self, obj):
        # Calculate total logins for the user
        return ActivityLog.objects.filter(user=obj, action='LOGIN').count()

    def get_total_downloads(self, obj):
        # Calculate total downloads for the user
        return ActivityLog.objects.filter(user=obj, action='DOWNLOAD').count()


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid email or password")


class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = '__all__'
