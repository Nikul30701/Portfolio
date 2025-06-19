import os.path
from django.http import Http404, FileResponse
from django.shortcuts import render
from .models import *

def home(request):
    projects = Projects.objects.all()
    skills = Skills.objects.all().order_by('name')
    context = {
        "projects":projects,
        "skills":skills
    }
    return render(request, "home.html", context)

def download_resume(request):
    try:
        resume = Resume.objects.latest('upload_at')
        print("Resume Object:", resume)
        print("Resume Path:", resume.file.path)

        file_path = resume.file.path

        if os.path.exists(file_path):
            fp = open(file_path, 'rb')
            response = FileResponse(fp, content_type="application/pdf")
            response['Content-Disposition'] = 'attachment; filename="resume.pdf"'
            return response
        else:
            raise Http404("Resume file not found.")

    except Resume.DoesNotExist:
        raise Http404("No resume has been uploaded yet!")

    except Exception as e:
        raise Http404(f"An unexpected error occurred: {e}.")
