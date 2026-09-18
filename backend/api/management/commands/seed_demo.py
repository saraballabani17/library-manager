from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from api.models import Book

DEMO_PASSWORD = "password123"

USERS = [
    ("alice@example.com", "Alice Nguyen"),
    ("bob@example.com", "Bob Martinez"),
    ("carol@example.com", "Carol Kim"),
]

CATALOG = {
    "dune": ("Dune", "Frank Herbert", "Sci-Fi", "15.99", 412),
    "1984": ("1984", "George Orwell", "Dystopia", "9.99", 328),
    "hobbit": ("The Hobbit", "J.R.R. Tolkien", "Fantasy", "12.50", 310),
    "harry_potter": ("Harry Potter and the Sorcerer's Stone", "J.K. Rowling", "Fantasy", "10.99", 309),
    "pride": ("Pride and Prejudice", "Jane Austen", "Classic", "7.99", 279),
    "gatsby": ("The Great Gatsby", "F. Scott Fitzgerald", "Classic", "6.99", 180),
    "gone_girl": ("Gone Girl", "Gillian Flynn", "Mystery", "11.99", 419),
    "sapiens": ("Sapiens", "Yuval Noah Harari", "Non-fiction", "16.99", 443),
}

LIBRARIES = {
    "alice@example.com": [
        ("dune", "reading"),
        ("1984", "completed"),
        ("hobbit", "completed"),
        ("sapiens", "completed"),
    ],
    "bob@example.com": [
        ("dune", "completed"),
        ("pride", "completed"),
        ("gatsby", "reading"),
    ],
    "carol@example.com": [
        ("dune", "want"),
        ("harry_potter", "completed"),
        ("gone_girl", "reading"),
    ],
}


class Command(BaseCommand):
    help = "Add demo users and books."

    def handle(self, *args, **options):
        for email, name in USERS:
            if not User.objects.filter(username=email).exists():
                User.objects.create_user(
                    username=email, email=email, first_name=name, password=DEMO_PASSWORD
                )

        for email, entries in LIBRARIES.items():
            owner = User.objects.get(username=email)
            for key, status in entries:
                title, author, genre, price, pages = CATALOG[key]
                Book.objects.get_or_create(
                    owner=owner,
                    title=title,
                    defaults={"author": author, "genre": genre, "price": price, "pages": pages, "status": status},
                )

        self.stdout.write(self.style.SUCCESS("Done. Demo users log in with password: " + DEMO_PASSWORD))
