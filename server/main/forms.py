from django import forms
from .models import Files
from django.forms import TextInput


class UploadFileForm(forms.ModelForm):

   class Meta:
      model = Files
      widgets = {
            'name': TextInput(attrs={'placeholder': 'Название статьи'}),
        }
      fields = ['name','file']
      labels = {
           'name' : '',
           'file':''
        }
      