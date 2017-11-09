$(() => {
  $('button').on('click', calc);
  $('input[type="number"]').on('change blur', format);
});

function calc()
{
  var sHour = $('#started').find('input[type="number"]').eq(0).val();
  var sMin  = $('#started').find('input[type="number"]').eq(1).val();
  var eHour = $('#ended').find('input[type="number"]').eq(0).val();
  var eMin  = $('#ended').find('input[type="number"]').eq(1).val();
  var bHour = $('#break').find('input[type="number"]').eq(0).val();
  var bMin  = $('#break').find('input[type="number"]').eq(1).val();

  var started = new Date();
  var ended   = new Date();
  started.setHours(sHour, sMin, 0, 0);
  ended.setHours(eHour, eMin, 0, 0);

  if(ended.getTime() < started.getTime()) {
    alert('ended time is earlier than started time!!');
    $('#result').text('error');
    return;
  }
  var diff = (ended.getTime() - started.getTime()) / (60 * 1000);
  var ans  = diff - (parseInt(bHour) * 60 + parseInt(bMin));

  if(ans < 0) {
    alert('break time is more than working time!!');
    $('#result').text('error');
    return;
  }

  $('#result').text(Math.floor(ans / 60) + 'H ' + ans % 60 + 'min');
}

function format(form)
{
  if($(this).is($('#break').find('input[type="number"]').eq(0))) {
    return;
  }

  var val = parseInt($(this).val());
  if(!Number.isInteger(val)) {
    $(this).val('00');
  } else if(val < 10) {
    $(this).val('0' + val);
  } else if(val < 0) {
    $(this).val('00');
  }

  if($(this).is($('#started').find('input[type="number"]').eq(0))
      || $(this).is($('#ended').find('input[type="number"]').eq(0))) {
    if(val > 23) {
      $(this).val('23');
    }
  } else if(val >= 60) {
    $(this).val('59');
  }
}
