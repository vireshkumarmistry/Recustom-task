from django.db import models
from django.contrib.auth.models import AbstractUser

from core.models import BaseModel
from users.managers import CustomUserManager


class CustomUser(BaseModel, AbstractUser):
    username = None
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('User', 'User'),
    ]
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    def save(self, *args, **kwargs):
        if not self.name:  # If name is not provided
            self.name = self.email  # Set name to email value
        super().save(*args, **kwargs)  # Call the original save method

    def __str__(self):
        return self.name


class ActivityLog(BaseModel):
    ACTION_CHOICES = [
        ('LOGIN', 'Login'),
        ('DOWNLOAD', 'Download'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    action = models.CharField(max_length=200, choices=ACTION_CHOICES, default="LOGIN")
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'timestamp']),
        ]

    def __str__(self):
        return f"{self.user} performed {self.action} at {self.timestamp}"
