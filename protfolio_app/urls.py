from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import *

app_name = 'protfolio_app'

urlpatterns = [
    path("", home, name="home"),
    path("download-resume/", download_resume, name='download_resume')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)