class OwnerPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.profile.role == 'owner'

class HeadPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.profile.role in ['owner', 'head']