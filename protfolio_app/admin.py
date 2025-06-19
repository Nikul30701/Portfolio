from django.contrib import admin
from .models import *


@admin.register(Projects)
class ProjectsAdmin(admin.ModelAdmin):
    list_display = ("title","description","images","project_url","framework")
    list_filter = ("title","description","images","project_url")


@admin.register(Skills)
class SkillsAdmin(admin.ModelAdmin):
    list_display = ("name","icon")
    list_filter = ("name", "icon")


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('title', 'upload_at', 'file')
    search_fields = ('title',)