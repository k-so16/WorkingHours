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
               .append(document.createTextNode(" : "))
               .append(sMinInput),
      $('<td>').append(eHourInput)
               .append(document.createTextNode(" : "))
               .append(eMinInput)
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
    var e_msg = 'The Ended time is earlier than started time!!';
    // alert(e_msg);
    $('#result').text('Error: ' + e_msg);
    return;
  }

  break_time = 
    parseInt($('#break_time input.hour').val()) * 60
    + parseInt($('#break_time input.min').val());

  total_time = worked_time - break_time;
  if (total_time < 0) {
    var e_msg = 'Your break time is longer than working time!!';
    // alert(e_msg);
    $('#result').text('Error: ' + e_msg);
    return;
  }

  var result_text = 'You worked '
    + parseInt(total_time / 60) + 'H ' + total_time % 60 + 'min long'
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
