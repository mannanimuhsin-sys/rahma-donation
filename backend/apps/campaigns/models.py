from django.db import models
from django.utils.text import slugify
from apps.organizations.models import Organization

class Campaign(models.Model):
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('PAUSED', 'Paused'),
    )

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='campaigns', null=True, blank=True)
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255, blank=True)
    description = models.TextField()
    category = models.CharField(max_length=100, default='General Sadqa & Zakat')
    target_amount = models.DecimalField(max_digits=12, decimal_places=2)
    collected_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    donor_count = models.IntegerField(default=0)
    banner_image = models.ImageField(upload_to='campaigns/banners/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Campaign.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    @property
    def percentage_completed(self):
        if not self.target_amount or self.target_amount == 0:
            return 0
        val = (self.collected_amount / self.target_amount) * 100
        return min(round(val, 1), 100)

    def __str__(self):
        return self.title
