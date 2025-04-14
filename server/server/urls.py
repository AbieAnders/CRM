"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('auth_.urls')),
    path('customers/', include('customers_.urls')),
    path('contacts/', include('contacts_.urls'))
    #path('sign_in/', include('auth.views'))
]

'''
from django.urls import URLPattern, URLResolver, get_resolver

def list_urls(urlpatterns, prefix=''):
    for pattern in urlpatterns:
        if isinstance(pattern, URLPattern):  # Simple path
            print(prefix + str(pattern.pattern))
        elif isinstance(pattern, URLResolver):  # Included URLs
            list_urls(pattern.url_patterns, prefix + str(pattern.pattern))

# Call it on startup
list_urls(get_resolver().url_patterns)
'''