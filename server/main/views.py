from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from .forms import UploadFileForm, UserForm, LogForm
from .models import Files, User, Signature
from pathlib import Path
from django.views.decorators.clickjacking import xframe_options_sameorigin
from django.core.paginator import Paginator
from .filters import FileFilter, ShortFilter
from web3 import Web3

BASE_DIR = Path(__file__).resolve().parent.parent.parent
w3 = Web3(Web3.IPCProvider(BASE_DIR / 'data/geth.ipc'))



class Web3Error(Exception):
    pass

# other Web3Error derived errors
# maybe Web3ClientError

class ResponseError(Web3Error):  # or Web3ClientError
    pass

class ResponseValueError(ValueError, ResponseError):
    pass

class ResponseNotFound(KeyError, ResponseError): 
    # as seen in https://github.com/ethereum/web3.py/blob/125c6aedc618a008f07069f09ddc3430002af0df/web3/manager.py#L197
    pass

def mw(request):
    if not request.session.get('wallet', False):
        return HttpResponseRedirect('/login')


class Api():
    def index(request):
        return HttpResponseRedirect('/')

class View():
    def index(request):
        files = Files.objects.all().order_by('-id')
        filter = FileFilter(request.GET, queryset=files)
        filter_short = ShortFilter(request.GET, queryset=files)
        total = User.objects.all().count()
        if filter:
            files = filter.qs
        else:
            files = filter_short.qs
        paginator = Paginator(files, 15)

        page_number = request.GET.get('page',1)
        page_obj = paginator.get_page(page_number)
        page_obj.adjusted_elided_pages = paginator.get_elided_page_range(page_number)
        auth = request.session.get('wallet', False)
        for file in page_obj:
            file.signed= Signature.objects.filter(file=file).count()
        return render(request, 'index.html', {"files":page_obj, "filter": filter, "short": filter_short,'auth':auth, 'total':total  })
    
    def upload_file(request):
        auth = request.session.get('wallet', False)
        if request.method == 'POST':
            form = UploadFileForm(request.POST, request.FILES)
            if form.is_valid():
                form.save()
                return HttpResponseRedirect('/')
        else:
            form = UploadFileForm
        return render(request, 'upload2.html', {'form': form, 'auth':auth})
    
    @xframe_options_sameorigin
    def show_pdf(request, id):
        errors=[]
        auth = request.session.get('wallet', False)
        filename = Files.objects.get(id=id)
        if request.method == 'POST':
            try:
                user = User.objects.get(wallet=auth)
                exist = Signature.objects.filter(file = filename, user=user).exists()
                if exist:
                    errors.append('Вы уже расписались')
                else:
                    s = w3.geth.personal.sign(filename.name, user.wallet, request.POST['password'])
                    print(s)
                    signature = Signature.objects.create(file=filename, user=user, hash=s)
                    signature.save()
                   
            except User.DoesNotExist:
                return HttpResponseRedirect('/login')
            except ValueError:
                errors.append('Неверная секретная фраза')
        users = User.objects.all().order_by('name')
        signs = Signature.objects.filter(file=filename)
        client_signed= False
        for us in users:
            us.signed=False
            for sgn in signs:
                if sgn.user.id==us.id:
                    if sgn.user.wallet==auth:
                        client_signed=True
                    us.signed = True
                    break
        return render(request, 'info.html', {'filename': filename.file, 'title':filename.name, 'users':users, 'errors':errors, 'client_signed':client_signed, 'auth':auth})#, 'signatures':signs})
    
    def login(request):
        errors=[]
        auth = request.session.get('wallet', False)
        if request.method == 'POST':
            form = LogForm(request.POST)
            try:
                if form.is_valid():
                    m = User.objects.get(wallet=form.cleaned_data['wallet'])
                                         
                    passwd =request.POST['password']
                    print(passwd)
                    print(request.POST['password'])
                    if w3.geth.personal.unlock_account(m.wallet, passwd):
                        request.session['wallet'] = m.wallet
                        return HttpResponseRedirect('/')
            except User.DoesNotExist:
                errors.append('Пользователя не существует')
        else: 
            form = LogForm
        
        return render(request, 'login.html', {'errors':errors, 'form':form, 'auth':auth})

    def register(request):
        auth = request.session.get('wallet', False)
        if request.method == 'POST':
            form = UserForm(request.POST)
            if form.is_valid():
                user=User()
                user.name = form.cleaned_data['name']
                wal = w3.geth.personal.new_account(request.POST.get('password',''))
                user.wallet = wal
                user.save()
                return HttpResponseRedirect('/')
        else:
            form = UserForm
        return render(request, 'register.html', {'form':form, 'auth':auth})
    
    def logout(request):
        try:
            del request.session['wallet']
        except KeyError:
            pass
        return HttpResponseRedirect('/')