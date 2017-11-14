'use strict'

var moment = require('moment');
var utility= require('./../infrastructure/utility');

var inquirerChoice = module.exports;

inquirerChoice.dateChoices = function (answers) {
    var result = [],
        startDate = moment(answers.startDate),
        endDate = moment(answers.endDate);

    do {
        result.push({
            name: startDate.format('YYYY-MM-DD(dddd)'),
            value: startDate.format('YYYY-MM-DD')
        });
        startDate.add(1, 'days');
    } while (startDate.valueOf() <= endDate.valueOf());
    return result;
};

inquirerChoice.weekChoices = function (answers) {
    var startDate = moment(answers.startDate),
        endDate = moment(answers.endDate);

    var result = [
        {
            name: 'Weekday(Mon~Fri)',
            value: 'weekday'
        },
        {
            name: 'Weekend(Sat~Sun)',
            value: 'weekend'
        },
        {
            name: 'Specific day of week',
            value: 'specificDay'
        },
        {
            name: 'Specific date',
            value: 'specificDate'
        }
    ];

    if (moment(startDate).day(7).valueOf() <= endDate.valueOf()) return result;

    var week = [0, 0, 0, 0, 0, 0, 0];

    do {
        week[startDate.day()]++;
        startDate.add(1, 'days');
    } while (startDate.valueOf() <= endDate.valueOf());

    if (!week[1] && !week[2] && !week[3] && !week[4] & !week[5]) result[0].disabled = 'out of range of date';
    if (!week[0] && !week[6]) result[1].disabled = 'out of range of date';

    return result;
};

inquirerChoice.dayOfWeekChoices = function (answers) {
    var week = utility.getWeekInfo(answers.startDate, answers.endDate);

    var result = [
        { name: 'Sunday', value: 0 },
        { name: 'Monday', value: 1 },
        { name: 'Tuesday', value: 2 },
        { name: 'Wednesday', value: 3 },
        { name: 'Thursday', value: 4 },
        { name: 'Friday', value: 5 },
        { name: 'Saturday', value: 6 }
    ];

    var i = 0;
    for (; i < 7; i++) {
        var day = week[i];
        if (!day.length) {
            result[i].disabled = 'out of range of date';
            continue;
        }
        result[i].name += '(' + day.join() + ')';
    }

    return result;
}