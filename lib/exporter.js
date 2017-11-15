'use strict'

var fs = require('fs');
var XlsxTemplate = require('xlsx-template');
var moment = require('moment');
var extend = require('node.extend');

var templateConfig = require('./../config/templateConfig');
var basicInfo = require('./../template/excel/basicInfo');

var exporter = module.exports = function () {
    this.rawData = {};
}

exporter.prototype.setRawData = function (rawData) {
    this.rawData = rawData;
}

function splitShedule(scheduleReportData) {
    var result = [],
        rawData = this.rawData
        ;

    var getColNData = function (data, n) {
        var result = {};

        if (!data) return;

        result['col' + n + 'Num'] = data.num;
        result['col' + n + 'Date'] = data.date;
        result['col' + n + 'DayOfWeek'] = data.dayOfWeek;
        result['col' + n + 'Time'] = data.time;
        result['col' + n + 'Second'] = data.second;

        return result;
    }

    var perCol = 37;
    var next = 38;

    result.push(scheduleReportData[perCol]);
    result.push(scheduleReportData[perCol + next]);

    while (scheduleReportData.length) {
        var i = 0;
        var tableResult = [];
        for (; i < perCol; i++) {
            var current = i;
            var rawResult = {};
            var n = 0;
            do {
                var data = scheduleReportData[current];
                var colNData = getColNData(data, n);
                rawResult = extend(rawResult, colNData);
                current += next;
                n++;
            } while (n < 3);
            tableResult.push(rawResult);
        }

        result.push(tableResult);
        scheduleReportData.splice(0, perCol + next * 2);
        perCol = 38;
    }

    return result;
}

function getSheduleReportData(timeArray) {
    var result = [],
        rawData = this.rawData
        ;

    var i = 0;
    for (; i < timeArray.length; i++) {
        var time = timeArray[i];
        result.push({
            num: i + 1,
            date: moment(time).format('MM/DD'),
            dayOfWeek: moment(time).locale('zh-tw').format('ddd'),
            time: moment(time).format('kk:mm:ss'),
            second: rawData.adTime
        });
    }

    return result;
}

exporter.prototype.outputReport = function (timeArray) {
    var rawData = this.rawData
        ;

    var schedule = splitShedule.call(this, getSheduleReportData.call(this, timeArray));

    fs.readFile(templateConfig.templatePath.excel, function (err, data) {
        var template = new XlsxTemplate(data);
        var sheetNumber = 1;

        var current = 2;
        while(current <= schedule.length - 2) {
            template.copySheet('copy', current);
            current++;
        }
        template.deleteSheet('copy');

        while (schedule.length) {
            var thisSheetSchedule = sheetNumber === 1 ?
                schedule.splice(0, 3) : schedule.splice(0, 1)[0];

            var values = {
                media: basicInfo.media,
                copyright: basicInfo.copyright,
                startDate: moment(rawData.startDate).format('YYYY/MM/DD'),
                endDate: moment(rawData.endDate).format('YYYY/MM/DD'),
                now: moment().format('YYYY/MM/DD A hh:mm:ss'),
                page: sheetNumber,
                schedule: thisSheetSchedule
            };

            if (sheetNumber === 1) {
                values.adName = rawData.adName;
            }

            template.substitute(sheetNumber, values);

            sheetNumber++;
        }

        var data = template.generate();

        fs.writeFile(templateConfig.outputDefaultFilePath, data, 'binary');
    });
}