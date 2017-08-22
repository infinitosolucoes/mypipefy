$(document).ready(function() {
  updateTables();
});

$('.mobile-menu-perfil').on('click', function(){
  $('body').toggleClass('menu-perfil-active');
});

$(window).scroll(function(){
  if($(this).scrollTop() >= 514){
    $('body').addClass('scrolled');
  }else{
    $('body').removeClass('scrolled');
  }
});

$('.click-to-top').on('click', function(){
  $('html,body').animate({ scrollTop:0 }, 800);
});


$('.buttonUpdateTable').on('click', function(){
  $('.loader-tables').fadeIn();
    setTimeout(function(){
      updateTables();
      $('.loader-tables').fadeOut();
    }, 1000);
  });

$('.close-modal-info').on('click', function(){
  $('.modal-info-table').fadeOut('slow');
});
$('tbody tr').on('click', function(){
  $('.modal-info-table').fadeIn('slow');
});

$(window).on('load', function(){

  var alturaWindow  = window.innerHeight;
  var larguraWindow = window.innerWidth,
  alturaApp         = $('div#app').height();
  var urlHer        = location.pathname;
  if(urlHer != '/mypipefy/public/login'){
    if(alturaApp < alturaWindow){
      if(alturaWindow >= 635 && larguraWindow >= 1000){
        var alturaApp = $('div#app').height();
        alturaApp += 151;
        var margintContainer = alturaWindow - alturaApp
        $('div#app').css('margin-bottom', margintContainer+'px');
      }
    }
}
  $('.loader').fadeOut('slow');
});

function loaderPulse(){
  setInterval(function(){
    $('body').removeClass('rodando');
    setTimeout(function(){
      $('body').addClass('rodando');
    },100);
  },3000);
}

function updateTables(){
  $('.tableDashboard').each(function(){
    $table = $(this);
    $table.DataTable().destroy();
    $table.find('tbody').html('');
    var route = $table.data('route');
    $table.children('tbody').html('');
    $.ajax({
      url: route,
      type: 'GET',
      dataType: 'json',
      async: false,
      beforeSend: function(){
        $table.siblings('.loader-tables').fadeIn();
      },
      success: function(data){
        $.each(data, function(index, card){
          var diff_days = calculaDias(card.due, true);
          var classColor = '';

          if(card.phaseName.toUpperCase() !== 'PENDENTE'){
            switch(diff_days){
              case false:
                classColor = 'normal';
              break;
              case 1:
                classColor = 'atrasado';
              break;
              default:
                classColor = 'very_atrasado';
            }
          }else{
            classColor = 'pendente';
          }
          classColor = (classColor != '') ? ' class="'+classColor+'"' : '';

          var $tr = '<tr data-toggle="tooltip" title="'+card.phaseName+'"'+classColor+'>';
          $tr += '<td><a href="https://app.pipefy.com/pipes/'+card.pipeId+'#cards/'+card.cardId+'" target="_blank">'+card.cardId+'</a></td>';
          $tr += '<td><a href="https://app.pipefy.com/pipes/'+card.pipeId+'" target="_blank">'+card.pipeName+'</a></td>';
          $tr += '<td>'+card.cardTitle+'</td>';
          $tr += '<td>'+card.clientName+'</td>';
          $tr += '<td>'+card.due+'</td>';
          $tr += '</tr>';
          $table.children('tbody').append($tr);
        });
      },
      complete: function(){
        $table.siblings('.loader-tables').fadeOut();
        $table.DataTable({
          order: [[4, 'asc']],
          language: {
            url: $("base").attr('href')+'plugins/datatables/languages/Portuguese-Brasil.json'
          }
        });
        $('[data-toggle="tooltip"]').tooltip({
          placement: (window.innerWidth < 768) ? 'top' : 'right'
        });
      }
    });
  });
}

function calculaDias(dateString, br){
  var diff = 0;

  if(!!dateString) {
    /* Data tables */
    if(br == true){
      var arr_date = dateString.split('/');
      dateString = arr_date[2]+'-'+arr_date[1]+'-'+arr_date[0];
    }

    var data1 = moment(dateString,'YYYY/MM/DD');
    var data2 = moment(getToday(),'YYYY/MM/DD');
    var diff  = data2.diff(data1, 'days');
  }

  return ((diff <= 0) ? false : diff);
}

function getToday(){
  var data = new Date();
  var today = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate();

  return today;
}
