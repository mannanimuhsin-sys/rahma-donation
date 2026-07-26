from django.db import models

class Organization(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255)
    tagline = models.CharField(max_length=255, blank=True, default="Empowering Communities & Charitable Causes")
    logo = models.ImageField(upload_to='organizations/logos/', null=True, blank=True)
    hero_banner = models.ImageField(upload_to='organizations/banners/', null=True, blank=True)
    about_text = models.TextField(blank=True, default="RAHMA is a dedicated platform facilitating transparent online donations for mosques, madrasas, and charitable organizations.")
    address = models.TextField(blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=50, blank=True)
    registration_number = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
