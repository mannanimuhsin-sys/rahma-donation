from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.organizations.models import Organization

class User(AbstractUser):
    class Role(models.TextChoices):
        SUPER_ADMIN = 'SUPER_ADMIN', 'Super Admin'
        ADMIN = 'ADMIN', 'Admin'
        DONOR = 'DONOR', 'Donor'

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.DONOR)
    phone = models.CharField(max_length=20, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    is_verified = models.BooleanField(default=True)

    def is_super_admin(self):
        return self.role == self.Role.SUPER_ADMIN or self.is_superuser

    def is_org_admin(self):
        return self.role in [self.Role.SUPER_ADMIN, self.Role.ADMIN] or self.is_superuser
