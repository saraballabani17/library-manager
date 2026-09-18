from django.db.models import Count


def answer_question(question, books):
    text = question.lower()

    if not books.exists():
        return "There are no books yet.", []

    if "owns the most" in text or "most books" in text:
        rows = books.values("owner__email").annotate(count=Count("id")).order_by("-count")
        top = rows[0]
        table = [{"owner": row["owner__email"], "books": row["count"]} for row in rows]
        return f"{top['owner__email']} owns the most books, with {top['count']}.", table

    if "most popular" in text:
        rows = books.values("title").annotate(owners=Count("owner", distinct=True)).order_by("-owners")
        top = rows[0]
        table = [{"title": row["title"], "owners": row["owners"]} for row in rows]
        return f'"{top["title"]}" is the most popular book, owned by {top["owners"]} people.', table

    if "common genre" in text:
        rows = books.exclude(genre="").values("genre").annotate(count=Count("id")).order_by("-count")
        top = rows[0]
        table = [{"genre": row["genre"], "books": row["count"]} for row in rows]
        return f"{top['genre']} is the most common genre.", table

    if "expensive" in text:
        top_books = books.order_by("-price")[:5]
        return "The most expensive books:", [_book_info(b) for b in top_books]

    if "cheap" in text:
        top_books = books.order_by("price")[:5]
        return "The cheapest books:", [_book_info(b) for b in top_books]

    if "longest" in text:
        top_books = books.order_by("-pages")[:5]
        return "The longest books:", [_book_info(b) for b in top_books]

    if "shortest" in text:
        top_books = books.order_by("pages")[:5]
        return "The shortest books:", [_book_info(b) for b in top_books]

    if "how many" in text:
        for genre in books.values_list("genre", flat=True).distinct():
            if genre and genre.lower() in text:
                count = books.filter(genre=genre).count()
                return f"There are {count} {genre} books.", []
        return f"There are {books.count()} books in total.", []

    return "Try asking things like 'who owns the most books' or 'most popular book'.", []


def _book_info(book):
    return {"title": book.title, "author": book.author, "price": str(book.price), "pages": book.pages}
