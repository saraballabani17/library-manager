from django.contrib.auth.models import User
from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .ai import answer_question
from .models import Book
from .serializers import AdminUserSerializer, BookSerializer, RegisterSerializer, UserSerializer


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Account created."}, status=201)


class MeView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)


class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            books = Book.objects.all()
        else:
            books = Book.objects.filter(owner=self.request.user)

        genre = self.request.query_params.get("genre")
        if genre:
            books = books.filter(genre__icontains=genre)

        status = self.request.query_params.get("status")
        if status:
            books = books.filter(status=status)

        return books

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class AdminUsersView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        users = User.objects.all().order_by("email")
        return Response(AdminUserSerializer(users, many=True).data)


class AdminUserDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        user = User.objects.get(pk=pk)
        if user == request.user:
            return Response({"error": "You can't change your own account here."}, status=400)
        if "is_admin" in request.data:
            user.is_staff = request.data["is_admin"]
        if "is_active" in request.data:
            user.is_active = request.data["is_active"]
        user.save()
        return Response(AdminUserSerializer(user).data)

    def delete(self, request, pk):
        user = User.objects.get(pk=pk)
        if user == request.user:
            return Response({"error": "You can't delete your own account."}, status=400)
        user.delete()
        return Response(status=204)


class AskView(APIView):
    def post(self, request):
        question = request.data.get("question", "")
        if request.user.is_staff:
            books = Book.objects.all()
        else:
            books = Book.objects.filter(owner=request.user)
        answer, table = answer_question(question, books)
        return Response({"answer": answer, "table": table})
