import django_filters
from .models import *
from django.forms.widgets import TextInput, NumberInput

class FileFilter(django_filters.FilterSet):
    CHOICES = (
        ('asc', 'Сначала новые'),
        ('desc', 'Сначала старые'),
        ('rate_asc', 'Возрастанию расписавшихся'),
        ('rate_desc', 'Убыванию расписавшихся')
    )
    ordering = django_filters.ChoiceFilter(label='Сортировать по', choices=CHOICES, method='filter_by_order')
    def filter_by_order(self, queryset, name, value):
            
            if value == 'asc' :
                expression = 'date' 
            elif value == 'desc' :
                expression = '-date'
            elif value == 'rate_asc' :
                expression = 'rating'
            elif value == 'rate_desc' :
                expression = '-rating'
            return queryset.order_by(expression)

    name = django_filters.CharFilter(label='', lookup_expr='icontains', widget=TextInput(attrs={'placeholder': 'Название'} ))
    class Meta:
        model = Files
        fields = ['name']

class ShortFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains', label='', widget=TextInput(attrs={'placeholder': 'Введите название'} ))
    class Meta:
        model = Files
        fields = ['name']
