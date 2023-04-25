"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
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
from main.views import View, Api
from django.conf.urls.static import  static

from django.conf import settings


api_patterns = [
    path("check/<int:fid>/<int:uid>", Api.checkSig)
]

view_patterns = [
    path("", View.index),
    path("upload", View.upload_file),
    path("article/<int:id>", View.show_pdf),
    path('register', View.register),
    path('login', View.login),
    path('logout', View.logout),
    path('account', View.account),
    path('tables', View.tables),
    path('table/<int:id>', View.show_table)

]


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include(api_patterns)),
    path('', include(view_patterns))
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)