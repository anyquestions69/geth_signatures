const ctx = document.getElementById('myChart');
let url =window.location.href.split('user/')[1]

fetch('/api/rating/'+url).then(res=>res.json()).then(result=>console.log(result))

const data = {
    labels: [
      'Продажи',
      'Надежность',
      'Покупки',
    ],
    datasets: [{
      label: 'Рейтинг',
      data: [7.4, 5.9, 9.0],
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)'
    }]
  };

const config = {
    type: 'radar',
    data: data,
    options: {
      elements: {
        line: {
          borderWidth: 3
        }
      },
      scales: {
        r: {
            angleLines: {
                display: false
            },
            suggestedMin: 0,
            suggestedMax: 10.0
        }
    }
    },
  };
  new Chart(ctx, config);


  const ctx2 = document.getElementById('customerRate');
  const ctx3 = document.getElementById('ordererRate');


  new Chart(ctx3, {
    type: 'pie',
    data: {
      labels: [
        'Побед в тендере',
        'Поражений в тендере',
        'Отказ заказчика'
      ],
      datasets: [{
        label: 'Рейтинг заказчика',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    },
  })

  new Chart(ctx2, {
    type: 'polarArea',
    data: {
      labels: [
        'Производство и обработка ресурсов',
        'Энергетика и экология',
        'Строительство и ремонт',
        'Услуги и общественное питание',
        'Другие виды деятельности'
      ],
      datasets: [{
        label: 'Рейтинг поставщика',
        data: [11, 16, 7, 3, 14],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)',
          'rgb(255, 205, 86)',
          'rgb(201, 203, 207)',
          'rgb(54, 162, 235)'
        ]
      }]
    },
  })