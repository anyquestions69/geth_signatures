from django.db import models
from datetime import datetime


class Files(models.Model):
    name = models.CharField(max_length=80, null=True)
    file = models.FileField(upload_to= 'files/',null=True)
    date = models.DateField(default=datetime.now, blank=True)
    signers = models.IntegerField(null=True)
    completed = models.BooleanField(default=False)

class User(models.Model):
    name = models.CharField(max_length=80, null=True)