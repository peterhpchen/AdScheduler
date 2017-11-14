'use strict'

var moment = require('moment');

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

utility.getDateByDayOfWeek = function (startDate, endDate, dayOfWeek) {
    var week = getWeekInfo(startDate, endDate);
    var result = [];

    var i = 0;
    for (; i < dayOfWeek.length; i++) {
        var day = week[dayOfWeek[i]];
        if (!day.length) continue;
        result = result.concat(day);
    }

    return result;
};

utility.getSelectedDate = function (answers) {
    var week = answers.week;
    var startDate = answers.startDate;
    var endDate = answers.endDate;
    var weekday = [1, 2, 3, 4, 5];
    var weekend = [0, 6];

    if (week === 'weekday') return getDateByDayOfWeek(startDate, endDate, weekday);
    if (week === 'weekend') return getDateByDayOfWeek(startDate, endDate, weekend);
    if (week === 'specificDay') return getDateByDayOfWeek(startDate, endDate, answers.playDay);
    return answers.playDate;
};