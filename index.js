var inquirer = require('inquirer');
var validator = require('validator');
var moment = require('moment');
var extend = require('node.extend');

var result = {};

function dateValidate(value) {
    if (moment(value, 'YYYY-MM-DD', true).isValid()) return true;
    return 'Please enter a valid date(YYYY-MM-DD)';
}

function endDateValidate(value, answers) {
    var dateValidateResult = dateValidate(value);
    var startDate = answers.startDate;

    if (typeof dateValidateResult != 'boolean') return dateValidateResult;
    if (validator.isAfter(value, startDate)) return true;
    if (validator.toDate(value).valueOf() == validator.toDate(startDate).valueOf()) return true;
    return 'Please enter a valid date(YYYY-MM-DD) which is after start date'
}

function intValidate(value) {
    if (Number.isInteger(value)) return true;
    if (validator.isInt(value)) return true;
    return 'Please enter a integer';

}

function timeValidate(value) {
    console.log(this);
    var intValidateResult = intValidate(value);
    if (typeof intValidateResult != 'boolean') return intValidateResult;
    if (value < 0 || value > 23) return 'Please enter valid time(0~23)';
    return true;
}

function adTimeValidate(value, answers) {
    var intValidateResult = intValidate(value);
    if (typeof intValidateResult != 'boolean') return intValidateResult;
    if (answers.secPerRound <= value) return 'Ad time can not more than round';
    return true;
}

function adCountValidate(value, answers) {
    var intValidateResult = intValidate(value);
    if (typeof intValidateResult != 'boolean') return intValidateResult;
    if (answers.secPerRound <= value * answers.adTime) return 'Ad time multi Ad count can not more than round';
    return true;
}

function dateChoices(answers) {
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
}

function getWeekInfo(startDate, endDate) {
    var result = [[], [], [], [], [], [], []],
        startDate = moment(startDate),
        endDate = moment(endDate);

    do {
        result[startDate.day()].push(startDate.format('YYYY-MM-DD'));
        startDate.add(1, 'days');
    } while (startDate.valueOf() <= endDate.valueOf());

    return result;
}

function dayOfWeekChoices(answers) {
    var week = getWeekInfo(answers.startDate, answers.endDate);

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

function weekChoices(answers) {
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
}

//function isMessageNeedDate() {
//    var timeAnswer = result.time;
//
//    if (timeAnswer === 'specificTime') return false;
//    return true;
//}
//
//function startTimeMessage() {
//    if (isMessageNeedDate()) return 'Enter start time(0~23): '
//}

var questions = [
    {
        type: 'input',
        name: 'startDate',
        message: 'Enter schedule start date: ',
        validate: dateValidate,
        default: moment().format('YYYY-MM-DD')
    },
    {
        type: 'input',
        name: 'endDate',
        message: 'Enter schedule end date: ',
        validate: endDateValidate,
        default: moment().format('YYYY-MM-DD')
    },
    {
        type: 'list',
        name: 'week',
        message: 'What day of week does the Ad play?',
        choices: weekChoices
    },
    {
        type: 'checkbox',
        name: 'playDay',
        message: 'Select What day of week you want to play.',
        default: [1, 2, 3, 4, 5],
        choices: dayOfWeekChoices,
        validate: function (value) {
            if (value.length < 1) return 'You must choose at least one day.';
            return true;
        },
        when: function (answers) {
            return answers.week === 'specificDay';
        }
    },
    {
        type: 'checkbox',
        name: 'playDate',
        message: 'Select What date you want to play.',
        choices: dateChoices,
        validate: function (value) {
            if (value.length < 1) return 'You must choose at least one date.';
            return true;
        },
        when: function (answers) {
            return answers.week === 'specificDate';
        }
    },
    {
        type: 'list',
        name: 'time',
        message: 'Which time period does the Ad play?',
        choices: [
            {
                name: '8 to 20',
                value: 'workTime'
            },
            {
                name: 'Specific time on the all day',
                value: 'specificTime'
            },
            {
                name: 'Specific time on the difference date',
                value: 'specificTimeOnDate'
            }
        ]
    }
];

var restQuestions = [
    {
        type: 'input',
        name: 'secPerRound',
        message: 'Enter second per round: ',
        default: 720,
        validate: intValidate
    },
    {
        type: 'input',
        name: 'adTime',
        message: 'Enter the Ad time(second): ',
        default: 10,
        validate: adTimeValidate
    },
    {
        type: 'input',
        name: 'adCount',
        message: 'Enter the Ad count per round',
        default: 1,
        validate: adCountValidate
    },
    {
        type: 'list',
        name: 'timePeriodInOneRound',
        message: 'Select what time period in one round you want',
        choices: [
            { name: 'Split', value: 'split' },
            { name: 'Specific time period', value: 'specific' }
        ]
    }
];

function timePeriodValidate(value, answers) {
    var intValidateResult = intValidate(value);
    if (typeof intValidateResult != 'boolean') return intValidateResult;

    var adCount = result.adCount,
        adTime = result.adTime,
        secPerRound = result.secPerRound;
    if (value < 0 || value > secPerRound) return 'Out of range(0~' + secPerRound + ')';

    var i = 0;
    for (; i < adCount; i++) {
        var currentTimePeriod = answers['startTimePeriod' + i];
        if (currentTimePeriod !== 0 && !currentTimePeriod) break;

        if (currentTimePeriod >= value + adTime) continue;
        if (currentTimePeriod + adTime <= value) continue;
        return 'Time period can not duplicate';
    }
    return true;
}

function getTimePeriodQuestions(adTime, adCount, secPerRound) {
    var result = [],
        timePeriod = secPerRound / adCount;

    var i = 0;
    for (; i < adCount; i++) {
        var current = i + 1;
        result.push({
            type: 'input',
            name: 'startTimePeriod' + i,
            message: 'Enter no ' + current + ' Ad time in every round(0~' + secPerRound + ')',
            default: timePeriod * i,
            validate: timePeriodValidate
        })
    }

    return result;
}

function getTimeQuestions(date) {
    var startTime = {
        type: 'input',
        name: 'startTime',
        message: 'Enter start time(0~23): ',
        default: 8,
        validate: timeValidate
    };

    var endTime = {
        type: 'input',
        name: 'endTime',
        message: 'Enter end time(If this is less than start time, this would be exchanged with start date.)(0~23): ',
        default: 20,
        validate: timeValidate
    };

    if (!date) return [startTime, endTime];
    startTime.name += '' + date.valueOf();
    startTime.message = 'Enter ' + date + ' start time: ';
    endTime.name += '' + date.valueOf();
    endTime.message = 'Enter ' + date + ' end time(If this is less than start time, this would be exchanged with start date.): ';
    return [startTime, endTime];
}

console.log('Start to create an Ad Schedule\n');

function getDateByDayOfWeek(startDate, endDate, dayOfWeek) {
    var week = getWeekInfo(startDate, endDate);
    var result = [];

    var i = 0;
    for (; i < dayOfWeek.length; i++) {
        var day = week[dayOfWeek[i]];
        if (!day.length) continue;
        result = result.concat(day);
    }

    return result;
}

function getSelectedDate(answers) {
    var week = answers.week;
    var startDate = answers.startDate;
    var endDate = answers.endDate;
    var weekday = [1, 2, 3, 4, 5];
    var weekend = [0, 6];

    if (week === 'weekday') return getDateByDayOfWeek(startDate, endDate, weekday);
    if (week === 'weekend') return getDateByDayOfWeek(startDate, endDate, weekend);
    if (week === 'specificDay') return getDateByDayOfWeek(startDate, endDate, answers.playDay);
    return answers.playDate;
}

function askTimePeriodQuestion(answers) {
    result = extend(result, answers);

    var timePeriodInOneRound = answers.timePeriodInOneRound;
    if (timePeriodInOneRound != 'specific') return inquirer.prompt([]);

    var adTime = answers.adTime,
        adCount = answers.adCount,
        secPerRound = answers.secPerRound;

    var questions = getTimePeriodQuestions(adTime, adCount, secPerRound);
    return inquirer.prompt(questions);
}

function askRestQuestion(answers) {
    result = extend(result, answers);
    return inquirer.prompt(restQuestions);
}

function askTimeQuestion(answers) {
    result = extend({}, answers);
    if (answers.time === 'workTime') return inquirer.prompt([]);
    if (answers.time === 'specificTime') return inquirer.prompt(getTimeQuestions());
    if (answers.time === 'specificTimeOnDate') {
        var dates = getSelectedDate(answers).sort();

        var timeQuestions = [];
        dates.forEach((date) => {
            timeQuestions = timeQuestions.concat(getTimeQuestions(date));
        });

        return inquirer.prompt(timeQuestions);
    }
}

function makeAdScheduler(answers) {
    result = extend(result, answers);

    console.log(result);
}

inquirer.prompt(questions).then(askTimeQuestion).then(askRestQuestion).then(askTimePeriodQuestion).then(makeAdScheduler);