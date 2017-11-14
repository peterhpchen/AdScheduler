'use strict'

var utility = module.exports;

utility.getWeekInfo = function (startDate, endDate) {
    var result = [[], [], [], [], [], [], []],
        startDate = moment(startDate),
        endDate = moment(endDate);

    do {
        result[startDate.day()].push(startDate.format('YYYY-MM-DD'));
        startDate.add(1, 'days');
    } while (startDate.valueOf() <= endDate.valueOf());

    return result;
};