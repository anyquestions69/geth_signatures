from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from .forms import UploadFileForm, UserForm, LogForm
from .models import Files, User, Signature, Role, Notification
from pathlib import Path
from django.views.decorators.clickjacking import xframe_options_sameorigin
from django.core.paginator import Paginator
from .filters import FileFilter, ShortFilter
from web3 import Web3


userRole  = Role.objects.get_or_create(name='user')
adminRole  = Role.objects.get_or_create(name='admin')

BASE_DIR = Path(__file__).resolve().parent.parent.parent
w3 = Web3(Web3.IPCProvider(BASE_DIR / 'data/geth.ipc'))



class Web3Error(Exception):
    pass


class ResponseError(Web3Error):  # or Web3ClientError
    pass

class ResponseValueError(ValueError, ResponseError):
    pass

class ResponseNotFound(KeyError, ResponseError): 
    pass

def mw(request):
    if not request.session.get('wallet', False):
        return HttpResponseRedirect('/login')


class Api():
    def index(request):
        return HttpResponseRedirect('/')
    def checkSig(request, fid, uid):
        try:
            file = Files.objects.get(id=fid)
            user = User.objects.get(id=uid)
            sign = Signature.objects.get(file=file, user=user)
            checked = w3.geth.personal.ec_recover(file.name, sign.hash)
            return JsonResponse({'sign':sign.hash, 'wallet':checked},safe=False, )
        except Signature.DoesNotExist:
            return JsonResponse({'error':'Не расписался'})

class View():
    def index(request):
        files = Files.objects.all().order_by('-id')

        filter_short = ShortFilter(request.GET, queryset=files)
        total = User.objects.all().count()
        files = filter_short.qs
        paginator = Paginator(files, 10)

        page_number = request.GET.get('page',1)
        page_obj = paginator.get_page(page_number)
        page_obj.adjusted_elided_pages = paginator.get_elided_page_range(page_number)
        auth = request.session.get('wallet', False)
        try:
            client = User.objects.get(wallet=auth)
        except User.DoesNotExist:
            client=False
        for file in page_obj:
            file.signed= Signature.objects.filter(file=file).count()
        return render(request, 'index.html', {"files":page_obj,  "short": filter_short,'auth':auth, 'total':total, 'client':client  })
    
    def upload_file(request):
        auth = request.session.get('wallet', False)
        files = Files.objects.all().order_by('-id')
        filter_short = ShortFilter(request.GET, queryset=files)
        try:
            client = User.objects.get(wallet=auth)
            if client.role.name=='admin':
                if request.method == 'POST':
                    form = UploadFileForm(request.POST, request.FILES)
                    if form.is_valid():
                        file = form.save()
                        notify = Notification.objects.all()
                        users = User.objects.all()
                        for us in users:
                            notify = Notification()
                            notify.file = file
                            notify.user = us
                        return HttpResponseRedirect('/')
                else:
                    form = UploadFileForm
                return render(request, 'upload2.html', {'form': form, 'auth':auth, 'client':client, 'short':filter_short})
            
        except User.DoesNotExist:
            client=False
            return HttpResponseRedirect('/login')
        return HttpResponseRedirect('/')
        
    @xframe_options_sameorigin
    def show_pdf(request, id):
        errors=[]
        auth = request.session.get('wallet', False)
        try:
            client = User.objects.get(wallet=auth)
        except User.DoesNotExist:
            client=False
        files = Files.objects.all().order_by('-id')
        filter_short = ShortFilter(request.GET, queryset=files)
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
                    filename.signers=Signature.objects.filter(file=filename).count()
                    if(filename.signers ==User.objects.all()):
                        filename.completed=True
                    filename.save()
            except User.DoesNotExist:
                return HttpResponseRedirect('/login')
            except ValueError:
                errors.append('Неверная секретная фраза')
        users = User.objects.all().order_by('name')
        signs = Signature.objects.filter(file=filename)
        client_signed= ''
        for us in users:
            us.signed=False
            for sgn in signs:
                if sgn.user.id==us.id:
                    if sgn.user.wallet==auth:
                        client_signed=sgn.user.wallet
                    us.signed = True
                    break
        return render(request, 'article.html', {'filename': filename, 
                                                'title':filename.name, 
                                                'users':users, 
                                                'errors':errors, 
                                                'client_signed':client_signed, 'auth':auth, 'short':filter_short, 'client':client})
    
    def login(request):
        errors=[]
        auth = request.session.get('wallet', False)
        try:
            client = User.objects.get(wallet=auth)
        except User.DoesNotExist:
            client=False
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
                            return HttpResponseRedirect('/account')
                        else:
                            errors.append('Неверная секретная фраза')
                        
                except User.DoesNotExist:
                    errors.append('Пользователя не существует')
                except ValueError:
                    errors.append('Неверная секретная фраза')
            else: 
                form = LogForm
            
            return render(request, 'login.html', {'errors':errors, 'form':form, 'auth':auth, 'client': client})
        return HttpResponseRedirect('/')

    def register(request):
        auth = request.session.get('wallet', False)
        try:
            client = User.objects.get(wallet=auth)
        except User.DoesNotExist:
            client=False
            if request.method == 'POST':
                form = UserForm(request.POST)
                if form.is_valid():
                    user=User()
                    user.name = form.cleaned_data['name']
                    wal = w3.geth.personal.new_account(request.POST.get('password',''))
                    user.wallet = wal
                    user.role=userRole
                    user.save()
                    request.session['wallet'] = user.wallet
                    return HttpResponseRedirect('/account')
            else:
                form = UserForm
            return render(request, 'register.html', {'form':form, 'auth':auth, 'client': client})
        return HttpResponseRedirect('/')
    
    def logout(request):
        try:
            del request.session['wallet']
        except KeyError:
            pass
        return HttpResponseRedirect('/')
    def account(request):
        try:
            auth = request.session.get('wallet', False)
            user = User.objects.get(wallet=auth)
            files = Files.objects.all().order_by('-id')
            filter_short = ShortFilter(request.GET, queryset=files)
            return render(request, 'user.html', {'user':user, 'auth':auth,'short':filter_short, 'client':user})
        except User.DoesNotExist:
            return HttpResponseRedirect('/login')
        
    def tables(request):
        auth = request.session.get('wallet', False)
        try:
            client = User.objects.get(wallet=auth)
            if client.role.name=='admin':
                files = Files.objects.all().order_by('-id')
                filter = FileFilter(request.GET, queryset=files)
                filter_short = ShortFilter(request.GET, queryset=files)
                total = User.objects.all().count()
                if filter:
                    files = filter.qs
                else:
                    files = filter_short.qs
                paginator = Paginator(files, 10)

                page_number = request.GET.get('page',1)
                page_obj = paginator.get_page(page_number)
                page_obj.adjusted_elided_pages = paginator.get_elided_page_range(page_number)
                auth = request.session.get('wallet', False)
                try:
                    client = User.objects.get(wallet=auth)
                except User.DoesNotExist:
                    client=False
                for file in page_obj:
                    file.signed= Signature.objects.filter(file=file).count()
                return render(request, 'tables.html', {"files":page_obj, "filter": filter, "short": filter_short,'auth':auth, 'total':total, 'client':client  })
        except User.DoesNotExist:
            client=False
            return HttpResponseRedirect('/login')
        return HttpResponseRedirect('/')
            
    @xframe_options_sameorigin
    def show_table(request, id):
        errors=[]
        auth = request.session.get('wallet', False)
        try:
            client = User.objects.get(wallet=auth)
            if client.role.name=='admin':
                files = Files.objects.all().order_by('-id')
                filter_short = ShortFilter(request.GET, queryset=files)
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
                    except ValueError:
                        errors.append('Неверная секретная фраза')
                users = User.objects.all().order_by('name')
                signs = Signature.objects.filter(file=filename)
                client_signed= ''
                for us in users:
                    us.signed=False
                    for sgn in signs:
                        if sgn.user.id==us.id:
                            if sgn.user.wallet==auth:
                                client_signed=sgn.user.wallet
                            us.signed = True
                            break
                return render(request, 'info.html', {'filename': filename, 
                                                        'title':filename.name, 
                                                        'users':users, 
                                                        'errors':errors, 
                                                        'client_signed':client_signed, 'auth':auth, 'short':filter_short, 'client':client})
            
        except User.DoesNotExist:
            client=False
            return HttpResponseRedirect('/login')
        return HttpResponseRedirect('/')
        
