$(document).ready(function () {
    $('#search').keyup( (e)=>{
        search = $('#search').val()
        fetch('api/filter?inn='+search).then(res=>res.json()).then(result=>console.log(result))
    })

    $('#opener').on('click', ()=>{
        $('#slide').toggle(100)
        $('#short_search').toggle(100)
    })
    
    $('.input-file input[type=file]').on('change', function(){

        let file = this.files[0];
    
        $(this).closest('.input-file').find('.input-file-text').html(file.name);
    
    });
    $("a.check").on('click', (event)=>{
        console.log(event)
    })
    var elements = document.getElementsByClassName('check')
});