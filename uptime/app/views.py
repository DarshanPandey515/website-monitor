from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .models import Website
from .serializers import WebsiteSerializer




class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id":user.id,
            "username":user.username
        })


class LoginAPIView(APIView):

    permission_classes = []

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({"error": "Invalid Credentials."}, status=400)

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        response = Response({
            "access": str(access),
        })

        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,  # true in prod
            samesite="Lax"

        )

        return response


class RefreshAPIView(APIView):
    permission_classes = []

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response({
                "error": "No refresh token."
            }, status=401)

        try:
            refresh = RefreshToken(refresh_token)
            access = refresh.access_token

            return Response({
                "access": str(access)
            })
        except TokenError:
            return Response({
                "error": "Invalid refresh token"
            }, status=401)


class LogoutAPIView(APIView):
    def post(self, request):
        response = Response({
            "message": "Logged Out"
        })

        response.delete_cookie("refresh_token")
        return response


class WebsiteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = WebsiteSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
