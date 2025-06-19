from django.db import models

class Projects(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    images = models.ImageField(upload_to="project",null=True, blank=True)
    project_url = models.URLField(null=True, blank=True, max_length=300)
    framework = models.CharField(max_length=150, null=True, blank=True)

    def __str__(self):
        return self.title

class Skills(models.Model):
    name = models.CharField(max_length=100)
    icon = models.ImageField(upload_to='media', null=True, blank=True)

    def __str__(self):
        return self.name


class Resume(models.Model):
    title = models.CharField(max_length= 100, help_text="Resume")
    file = models.FileField(upload_to="resume/")
    upload_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering  = ['-upload_at']
        verbose_name = "Resume"
        verbose_name_plural = "Resumes"