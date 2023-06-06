function getDate(today){
    const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();
  
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  
  return {str:dd + '.' + mm + '.' + yyyy, dd, mm, yyyy};
  }

  function getUsers(page){
    let params = `/`
    let url = `/api/users/`
    fetch(`${url}?page=${page||1}`).then(response => response.json()).then(res=>{
      console.log(res)
      $('#users').empty()
      for( let r of res.users){
            r.date = getDate(new Date(r.createdAt))
            let li = 
            `<div class="d-flex text-body-secondary justify-content-between pt-3 border-bottom">
              
              <p class="pb-3 mb-0 small lh-sm ">
                <strong class="d-block text-gray-dark">${r.name}</strong>
                ${r.wallet}
              </p>
              <p class="pb-3 mb-0 small lh-sm"> Зарегистрирован с ${r.date.str}</p>
            </div>`
                    $('#users').append(li)
          
      }
      $('#pagination-users').empty()
      if(res.currentPage>1){
      $('#pagination-users').append(` <li class="page-item"><a class="page-link" onclick="getUsers(1)">В начало</a></li>
  <li class="page-item"><a class="page-link" onclick=getUsers(${res.currentPage-1})>${res.currentPage-1}</a></li>
  <li class="page-item active"><a class="page-link" onclick=getUsers(${res.currentPage})>${res.currentPage||1}</a></li>`)
      if(res.currentPage!=res.totalPages){
      $('#pagination-users').append(` 
      <li class="page-item"><a class="page-link" onclick="getUsers(${res.currentPage+1})">${res.currentPage+1}</a></li>
      <li class="page-item"><a class="page-link" onclick="getUsers(${res.totalPages})">В конец</a></li>`)
      }
      }else{
        $('#pagination-users').append(` <li class="page-item disabled"><a disabled class="page-link" onclick="getUsers(1)">В начало</a></li>
  <li class="page-item active"><a class="page-link" onclick="getUsers(${res.currentPage})">${res.currentPage||1}</a></li>`)
        if(res.currentPage!=res.totalPages){
      $('#pagination-users').append(` 
      <li class="page-item"><a class="page-link" onclick="getUsers(${res.currentPage+1})">${res.currentPage+1}</a></li>
      <li class="page-item"><a class="page-link" onclick="getUsers(${res.totalPages})">В конец</a></li>`)
      }
      }
          
  })
  }
  function getFiles(page){
    let params = `/`
    let url = `/api/files/`
    fetch(`${url}?page=${page||1}`).then(response => response.json()).then(res=>{
      console.log(res)
      $('#files').empty()
      for( let r of res.files){
            r.date = getDate(new Date(r.createdAt))
            r.sigs=[]
            for(let us of r.users){
              r.sigs.push(us.signature.hash)
            }
            let li = 
            `<div class="d-flex text-body-secondary justify-content-between pt-3 border-bottom">
              
              <p class="pb-3 mb-0 small lh-sm ">
                <strong class="d-block text-gray-dark">${r.name}</strong>
                ${r.date.str}
              </p>
              <p class="pb-3 mb-0 small lh-sm">${r.users.length}/${res.userCount}</p>
            </div>`
                    $('#files').append(li)
          
      }
      $('#pagination-files').empty()
      if(res.currentPage>1){
      $('#pagination-files').append(` <li class="page-item"><a class="page-link" onclick="getFiles(1)">В начало</a></li>
  <li class="page-item"><a class="page-link" onclick=getFiles(${res.currentPage-1})>${res.currentPage-1}</a></li>
  <li class="page-item active"><a class="page-link" onclick=getFiles(${res.currentPage})>${res.currentPage||1}</a></li>`)
      if(res.currentPage!=res.totalPages){
      $('#pagination-files').append(` 
      <li class="page-item"><a class="page-link" onclick="getFiles(${res.currentPage+1})">${res.currentPage+1}</a></li>
      <li class="page-item"><a class="page-link" onclick="getFiles(${res.totalPages})">В конец</a></li>`)
      }
      }else{
        $('#pagination-files').append(` <li class="page-item disabled"><a disabled class="page-link" onclick="getFiles(1)">В начало</a></li>
  <li class="page-item active"><a class="page-link" onclick="getFiles(${res.currentPage})">${res.currentPage||1}</a></li>`)
        if(res.currentPage!=res.totalPages){
      $('#pagination-files').append(` 
      <li class="page-item"><a class="page-link" onclick="getFiles(${res.currentPage+1})">${res.currentPage+1}</a></li>
      <li class="page-item"><a class="page-link" onclick="getFiles(${res.totalPages})">В конец</a></li>`)
      }
      }
          
  })
  }

function getData(page){
    let params = `/`
    let url = `/api/files/`
    fetch(`${url}?page=${page}`).then(response => response.json()).then(res=>{
  
      $('#list').empty()
      for( let r of res.files){
            r.date = getDate(new Date(r.createdAt))
            let li = 
            `<a href="/files/${r.id}" class="list-group-item list-group-item-action" aria-current="true">
  <div class="d-flex w-100 justify-content-between">
  <div>
  
    <h5 class="mb-1"><b>${r.name}</b></h5>
  
  </div>
  <div>${r.date.str}</div>
  
  </div>
  <div class="d-flex w-100 justify-content-between align-items-center">
  
  <button class='btn btn-primary float-right'>Записаться</button>
  </div>
  </a>
                    `
                    $('#list').append(li)
          
      }
      $('#pagination').empty()
      if(res.currentPage>1){
      $('#pagination').append(` <li class="page-item"><a class="page-link" href="${params}page=1">В начало</a></li>
  <li class="page-item"><a class="page-link" href="${params}page=${res.currentPage-1}">${res.currentPage-1}</a></li>
  <li class="page-item active"><a class="page-link" href="${params}page=${res.currentPage}">${res.currentPage}</a></li>`)
      if(res.currentPage!=res.totalPages){
      $('#pagination').append(` 
      <li class="page-item"><a class="page-link" href="${params}page=${res.currentPage+1}">${res.currentPage+1}</a></li>
      <li class="page-item"><a class="page-link" href="${params}page=${res.totalPages}">В конец</a></li>`)
      }
      }else{
        $('#pagination').append(` <li class="page-item disabled"><a disabled class="page-link" href="/?page=1">В начало</a></li>
  <li class="page-item active"><a class="page-link" href="${params}page=${res.currentPage}">${res.currentPage||1}</a></li>`)
        if(res.currentPage!=res.totalPages){
      $('#pagination').append(` 
      <li class="page-item"><a class="page-link" href="${params}page=${res.currentPage+1}">${res.currentPage+1}</a></li>
      <li class="page-item"><a class="page-link" href="${params}page=${res.totalPages}">В конец</a></li>`)
      }
      }
          
  })
  }

  $('#dropdown').on('click',()=>{
    $('#dropdown-menu').toggle()
  })