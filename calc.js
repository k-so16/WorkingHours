var app = new Vue({
  el: '#app',
  data: {
    workedList: [
      {
        started: { hour: 10, min: 0 },
        ended:   { hour: 15, min: 0 }
      }
    ],
    breakTime: { hour: 0, min: 0 }
  },

  computed: {
    workedTime: function() {
      var total = 0;
      for (var item of this.workedList) {
        var started = new Date();
        var ended   = new Date();

        // filtering input values of working time
        item.started.hour =
          this.checkMaxLimit(this.checkMinLimit(item.started.hour, 0), 23);
        item.started.min =
          this.checkMaxLimit(this.checkMinLimit(item.started.min, 0), 59);
        item.ended.hour =
          this.checkMaxLimit(this.checkMinLimit(item.ended.hour, 0), 23);
        item.ended.min =
          this.checkMaxLimit(this.checkMinLimit(item.ended.min, 0), 59);

        started.setHours(item.started.hour, item.started.min, 0, 0);
        ended.setHours(item.ended.hour, item.ended.min, 0, 0);

        var diff =
          parseInt((ended.getTime() - started.getTime()) / (60 * 1000));
        if (diff < 0) {
          return 'Error: 終了時刻が開始時刻より早いです';
        }
        total += diff;
      }

      // filtering input values of break time
      this.breakTime.hour = this.checkMinLimit(this.breakTime.hour, 0);
      this.breakTime.min =
        this.checkMaxLimit(this.checkMinLimit(this.breakTime.min, 0), 59);

      var restTime = parseInt(this.breakTime.hour) * 60
                     + parseInt(this.breakTime.min)
      total -= restTime
      if (total < 0) {
        return 'Error: 休憩時間が勤務時間より長いです';
      } else {
        return '勤務時間: ' + parseInt(total / 60) + '時'
                            + parseInt(total % 60) + '分';
      }
    }
  },

  methods: {
    addRow: function() {
      var data = {
        started: { hour: 10, min: 0 },
        ended:   { hour: 15, min: 0 }
      };
      this.workedList.push(data);
    },
    delRow: function(index) {
      this.workedList.splice(index, 1);
    },
    checkMinLimit: function(val, min) {
      if (typeof val !== 'number') {
        return min;
      } else if (val < min) {
        return min;
      }
      return val;
    },
    checkMaxLimit: function(val, max) {
      if (typeof val !== 'number') {
        return max;
      } else if (val > max) {
        return max;
      }
      return val;
    }
  }
});
