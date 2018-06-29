$(function() {
  $('button#calc').on('click', calc);
  $('input[type="number"]').on('change blur', format);

  $(document).on('click', '.add_working_hours_row', function() {
    var table      = $(this).parents('table');
    var tr         = $('<tr>');
    var addButton  = $('<button>');
    var delButton  = $('<button>');
    var sHourInput = $('<input>');
    var sMinInput  = $('<input>');
    var eHourInput = $('<input>');
    var eMinInput  = $('<input>');

    addButton.attr({'type' : 'button', 'class' : 'add_working_hours_row'});
    addButton.text('+');
    delButton.attr({'type' : 'button', 'class' : 'del_working_hours_row'});
    delButton.text('-');

    sHourInput.attr({'type' : 'number', 'class': 'hour', 'max' : '23'});
    sHourInput.val('10');
    sMinInput.attr({'type' : 'number', 'class' : 'min', 'max' : '59'});
    sMinInput.val('00');
    eHourInput.attr({'type' : 'number', 'class' : 'hour', 'max' : '23'});
    eHourInput.val('15');
    eMinInput.attr({'type' : 'number', 'class' : 'min', 'max' : '59'});
    eMinInput.val('00');

    tr.append([
      $('<td>').append(addButton),
      $('<td>').append(delButton),
      $('<td>').append(sHourInput)
               .append(document.createTextNode(" 時 "))
               .append(sMinInput)
               .append(document.createTextNode(" 分 ")),
      $('<td>').append(eHourInput)
               .append(document.createTextNode(" 時 "))
               .append(eMinInput)
               .append(document.createTextNode(" 分 "))
    ]);
    table.append(tr);

    $('button.del_working_hours_row').prop('disabled', false);
  });

  $(document).on('click', '.del_working_hours_row', function() {
    $(this).parents('tr').remove();

    if ($('button.del_working_hours_row').length == 1) {
      $('button.del_working_hours_row').prop('disabled', true);
    }
  });
});

function calc()
{
  var worked_time = 0;
  var break_time  = 0;
  var total_time  = 0;

  /* calclate total time of worked time */
  $('#working_hours_list tr').each(function() {
    if ($(this).find('th').length) {
      return;
    }

    var sHour = $(this).find('.hour').eq(0).val();
    var sMin  = $(this).find('.min').eq(0).val();
    var eHour = $(this).find('.hour').eq(1).val();
    var eMin  = $(this).find('.min').eq(1).val();

    var started = new Date();
    var ended   = new Date();
    started.setHours(sHour, sMin, 0, 0);
    ended.setHours(eHour, eMin, 0, 0);

    var diff =
      parseInt((ended.getTime() - started.getTime()) / (60 * 1000));

    if (diff < 0) {
      worked_time = -1;
    } else if (worked_time >= 0) {
      worked_time += diff
    }
  });

  if (worked_time < 0) {
    var e_msg = '終了時刻が開始時刻より早いです';
    // alert(e_msg);
    $('#result').text('Error: ' + e_msg);
    return;
  }

  break_time = 
    parseInt($('#break_time input.hour').val()) * 60
    + parseInt($('#break_time input.min').val());

  total_time = worked_time - break_time;
  if (total_time < 0) {
    var e_msg = '休憩時間が勤務時間より長いです';
    // alert(e_msg);
    $('#result').text('Error: ' + e_msg);
    return;
  }

  var result_text = '勤務時間: '
    + parseInt(total_time / 60) + '時間' + total_time % 60 + '分'
  $('#result').text(result_text);
}

function format(form)
{
  var val = parseInt($(this).val());
  if (!Number.isInteger(val) || val < 0) {
    switch ($(this).attr('class')) {
      case 'hour':
        $(this).val('0');
        break;
      case 'min':
        $(this).val('00');
        break;
    }
  } else if (val < 10) {
    switch ($(this).attr('class')) {
      case 'hour':
        $(this).val(val);
        break;
      case 'min':
        $(this).val('0' + val);
        break;
    }
  }

  if ($(this).attr('class') === 'hour') {
    if (val > 23) {
      $(this).val('23');
    }
  } else if (val >= 60) {
    $(this).val('59');
  }
}
