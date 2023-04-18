from django import forms
from .models import Files, User
from django.forms import TextInput, PasswordInput


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
      
class UserForm(forms.ModelForm):

   class Meta:
      model = User
      widgets = {
            'name': TextInput(attrs={'placeholder': 'Фамилия Имя Отчество'}),
           
        }
      fields = ['name']
      labels = {
           'name' : ''
        }
      

class LogForm(forms.ModelForm):
   class Meta:
      model = User
      widgets = {
            'wallet': TextInput(attrs={'placeholder': 'Адрес кошешлька'}),
           
        }
      fields = ['wallet']
      labels = {
           'wallet' : ''
        }