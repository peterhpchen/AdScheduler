'use strict'

var Scheduler = module.exports = function (arranger, exporter) {
    this.arranger = arranger;
    this.exporter = exporter;
}

Scheduler.prototype.arrange = function (data) {
    this.schedule = this.arranger.arrangeDataToSchedule(data);
}

Scheduler.prototype.output = function (schedule) {
    if (!schedule || !schedule.length) schedule = this.schedule;
    if (!schedule || !schedule.length) return;
    this.exporter.outputReport(schedule);
}