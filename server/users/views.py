from datetime import datetime, timedelta

from django.contrib.auth import get_user_model
from django.http import HttpResponse, JsonResponse
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import ActivityLog, CustomUser
from users.permissions import IsAdminOrOwner
from users.serializers import CustomUserSerializer, LoginSerializer
from users.utils import log_user_login, log_file_download, generate_user_activity_report
from django.utils import timezone

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = []

    @staticmethod
    def get_user_or_404(pk):
        """ Helper method to get user or raise 404 """
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise NotFound("User not found")


    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            log_user_login(user)

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': CustomUserSerializer(user).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='profile')
    def profile(self, request):
        """ Returns the profile of the authenticated user """
        user = request.user
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)

    @action(detail=True, methods=['put'], permission_classes=[IsAdminOrOwner], url_path='update')
    def update_user(self, request, pk=None):
        user = self.get_user_or_404(pk)
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'], permission_classes=[IsAdminOrOwner], url_path='delete')
    def delete_user(self, request, pk=None):
        user = self.get_user_or_404(pk)
        user.delete()
        return Response({"detail": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get'], url_path='download_report', permission_classes=[])
    def download_report(self, request, pk=None):
        user = self.get_user_or_404(pk)
        current_time = datetime.now().strftime("%m-%d_%H-%M")
        report_name = f"report_{current_time}.pdf"
        log_file_download(user, report_name)
        activity_logs = ActivityLog.objects.filter(user=user)
        login_logs = activity_logs.filter(action='LOGIN')
        download_logs = activity_logs.filter(action='DOWNLOAD')

        # Generate the PDF and get the report name
        pdf, report_name = generate_user_activity_report(user, login_logs, download_logs)

        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename={report_name}'
        return response

    @action(detail=False, methods=['get'], url_path='dashboard_stats')
    def dashboard_stats(self, request):
        """ Returns total users, logins today, and downloads today """
        today_start = timezone.now().date()  # Get today's date
        today_end = today_start + timedelta(days=1)  # Get the end of today

        # Get total users count
        total_users = User.objects.count()

        # Get total logins today
        total_logins_today = ActivityLog.objects.filter(
            action='LOGIN',
            timestamp__gte=today_start,
            timestamp__lt=today_end
        ).count()

        # Get total downloads today
        total_downloads_today = ActivityLog.objects.filter(
            action='DOWNLOAD',
            timestamp__gte=today_start,
            timestamp__lt=today_end
        ).count()

        # Return all the stats in one JSON response
        return JsonResponse({
            'total_users': total_users,
            'total_logins_today': total_logins_today,
            'total_downloads_today': total_downloads_today,
        })
