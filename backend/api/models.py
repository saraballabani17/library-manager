from django.contrib.auth.models import User
from django.db import models


class Book(models.Model):
    STATUS_CHOICES = [
        ("want", "Want to read"),
        ("reading", "Reading"),
        ("completed", "Completed"),
    ]

    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    genre = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="want")
    price = models.DecimalField(max_digits=7, decimal_places=2, default=0)
    pages = models.PositiveIntegerField(default=0)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="books")

    def __str__(self):
        return self.title
