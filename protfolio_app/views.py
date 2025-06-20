import os.path
from email.message import EmailMessage
from django.contrib import messages
from django.core.mail import send_mail
from django.http import Http404, FileResponse
from django.shortcuts import render, redirect
from django.urls import reverse

from my_site import settings
from .forms import ContactForm
from .models import *

def home(request):
    projects = Projects.objects.all()
    skills = Skills.objects.all().order_by('name')
    contact_form = ContactForm()
    context = {
        "projects":projects,
        "skills":skills,
        'contact_form':contact_form
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


def contact(request):
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data["name"]
            email = form.cleaned_data["email"]
            subject = form.cleaned_data["subject"]
            message = form.cleaned_data["message"]


            email_body = f"Message from {name} <{email}>:\n\nSubject: {subject}\n\n{message}"

            try:

                send_mail(
                    subject=f"Portfolio Contact: {subject}",
                    message=email_body,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                )

                messages.success(request, "Your message has been sent successfully! I'll get back to you soon.")
            except Exception as e:
                print(f"Error sending contact email: {e}")
                messages.error(request, "Failed to send your message. Please try again later or contact me directly.")
        else:

            messages.error(request, "Please correct the errors in the form and try again.")

    return redirect(reverse("protfolio_app:home"))