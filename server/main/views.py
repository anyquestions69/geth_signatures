from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from .forms import UploadFileForm
from .models import Files
from django.http import FileResponse
import os
from pathlib import Path
from django.views.decorators.clickjacking import xframe_options_sameorigin
from django.core.paginator import Paginator
from .filters import FileFilter, ShortFilter
 
class Api():
    def index(request):
        return HttpResponseRedirect('/')
    def show_pdf(request):
        filename = Files.objects.get(id=2)
        BASE_DIR = Path(__file__).resolve().parent.parent
        filepath = BASE_DIR / 'media'
        filepath = str(filepath) +'/'+ str(filename.file)
        print(filepath)
        with open(filepath, 'r') as pdf_document:
            response = HttpResponse(pdf_document.read(),contenttype ='application/pdf')
            return response
    def file(request):
        filepath =Path(__file__).resolve().parent.parent / 'media/files/1.pdf'
        return FileResponse(open(filepath, 'rb'), content_type='application/pdf')

class View():
    def index(request):
        files = Files.objects.all().order_by('-id')
        filter = FileFilter(request.GET, queryset=files)
        filter_short = ShortFilter(request.GET, queryset=files)
        if filter:
            files = filter.qs
        else:
            files = filter_short.qs
        paginator = Paginator(files, 15)

        page_number = request.GET.get('page',1)
        page_obj = paginator.get_page(page_number)
        page_obj.adjusted_elided_pages = paginator.get_elided_page_range(page_number)
        return render(request, 'index.html', {"files":page_obj, "filter": filter, "short": filter_short})
    
    def upload_file(request):
        if request.method == 'POST':
            form = UploadFileForm(request.POST, request.FILES)
            if form.is_valid():
                form.save()
                return HttpResponseRedirect('/')
        else:
            form = UploadFileForm
        return render(request, 'upload2.html', {'form': form})
    
    @xframe_options_sameorigin
    def show_pdf(request, id):
        filename = Files.objects.get(id=id)
        print(filename.file)
        return render(request, 'info.html', {'filename': filename.file, 'title':filename.name})