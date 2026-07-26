from rest_framework import viewsets, permissions
from .models import Organization
from .serializers import OrganizationSerializer

class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_field
        if lookup_url_kwarg in self.kwargs:
            val = self.kwargs[lookup_url_kwarg]
            if val == 'default' or val == 'active':
                obj = queryset.first()
                if obj:
                    return obj
        return super().get_object()
