from django.core.management.base import BaseCommand
from users.models import CustomUser, ActivityLog
from django.utils import timezone
import random


class Command(BaseCommand):
    help = 'Seed data for CustomUser and ActivityLog'

    def handle(self, *args, **kwargs):
        # Seed CustomUser data
        users = []
        for i in range(1, 10):
            user = CustomUser.objects.create(
                email=f'user{i}@example.com',
                name=f'User {i}',
                role=random.choice(['Admin', 'User'])
            )
            users.append(user)
            self.stdout.write(self.style.SUCCESS(f'Successfully created user: {user.email}'))

        # Seed ActivityLog data with more than 5 random logs per user
        actions = ['LOGIN', 'DOWNLOAD']
        for user in users:
            num_logs = random.randint(6, 10)  # Create between 6 to 10 logs per user
            for _ in range(num_logs):
                action = random.choice(actions)
                log = ActivityLog.objects.create(
                    user=user,
                    action=action,
                    timestamp=timezone.now(),
                    details={"file_name": f"file_{random.randint(1, 10)}.txt"} if action == 'DOWNLOAD' else None
                )
                self.stdout.write(self.style.SUCCESS(f'Successfully created log: {log}'))

        self.stdout.write(self.style.SUCCESS('Seeding completed.'))
