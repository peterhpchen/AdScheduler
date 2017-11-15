'use strict'

var Scheduler = module.exports = function (arranger, exporter, rawData) {
    this.arranger = arranger;
    this.exporter = exporter;

    this.timeArray = [];
    this.schedule = [];

    this.arranger.setRawData(rawData);
    this.exporter.setRawData(rawData);
}

Scheduler.prototype.arrange = function (data) {
    this.timeArray = this.arranger.arrangeRawDataToTimeArray(data);
}

Scheduler.prototype.output = function () {
    this.exporter.outputReport(this.timeArray);
}