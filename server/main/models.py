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
    wallet  = models.CharField(max_length=42, null=True)

class Signature(models.Model):
    file = models.ForeignKey(Files,null=True, on_delete = models.CASCADE)
    user = models.ForeignKey(User,null=True, on_delete = models.CASCADE)
    hash = models.CharField(null=True)
    date = models.DateField(default=datetime.now, blank=True)