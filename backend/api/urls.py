from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter

from .views import AdminUserDetailView, AdminUsersView, AskView, BookViewSet, MeView, RegisterView

router = DefaultRouter()
router.register("books", BookViewSet, basename="book")

urlpatterns = [
    path("auth/register/", RegisterView.as_view()),
    path("auth/login/", obtain_auth_token),
    path("auth/me/", MeView.as_view()),
    path("admin/users/", AdminUsersView.as_view()),
    path("admin/users/<int:pk>/", AdminUserDetailView.as_view()),
    path("ai/query/", AskView.as_view()),
    path("", include(router.urls)),
]
