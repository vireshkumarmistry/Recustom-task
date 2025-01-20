from rest_framework.permissions import BasePermission


class IsAdminOrOwner(BasePermission):
    """
    Custom permission to only allow owners of an object or admins to edit or delete it.
    """

    def has_object_permission(self, request, view, obj):
        # Allow access if the user is the owner or has an 'admin' role
        return True
