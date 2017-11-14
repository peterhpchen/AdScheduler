'use strict'

var moment = require('moment');

var inquirerValidator = require('./validator');
var inquirerChoice = require('./choice');

var inquirerQuestion = module.exports;

inquirerQuestion.mainQuestions = [
    {
        type: 'input',
        name: 'startDate',
        message: 'Enter schedule start date: ',
        validate: inquirerValidator.dateValidate,
        default: moment().format('YYYY-MM-DD')
    },
    {
        type: 'input',
        name: 'endDate',
        message: 'Enter schedule end date: ',
        validate: inquirerValidator.endDateValidate,
        default: moment().format('YYYY-MM-DD')
    },
    {
        type: 'list',
        name: 'week',
        message: 'What day of week does the Ad play?',
        choices: inquirerChoice.weekChoices
    },
    {
        type: 'checkbox',
        name: 'playDay',
        message: 'Select What day of week you want to play.',
        default: [1, 2, 3, 4, 5],
        choices: inquirerChoice.dayOfWeekChoices,
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
        choices: inquirerChoice.dateChoices,
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

inquirerQuestion.restQuestions = [
    {
        type: 'input',
        name: 'secPerRound',
        message: 'Enter second per round: ',
        default: 720,
        validate: inquirerValidator.intValidate
    },
    {
        type: 'input',
        name: 'adTime',
        message: 'Enter the Ad time(second): ',
        default: 10,
        validate: inquirerValidator.adTimeValidate
    },
    {
        type: 'input',
        name: 'adCount',
        message: 'Enter the Ad count per round',
        default: 1,
        validate: inquirerValidator.adCountValidate
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

inquirerQuestion.timePeriodQuestions = function (adTime, adCount, secPerRound) {
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
            validate: inquirerValidator.timePeriodValidate.bind(null, adTime, adCount, secPerRound)
        });
    }

    return result;
}

inquirerQuestion.timeQuestions = function (date) {
    var startTime = {
        type: 'input',
        name: 'startTime',
        message: 'Enter start time(0~23): ',
        default: 8,
        validate: inquirerValidator.timeValidate
    };

    var endTime = {
        type: 'input',
        name: 'endTime',
        message: 'Enter end time(If this is less than start time, this would be exchanged with start date.)(0~23): ',
        default: 20,
        validate: inquirerValidator.timeValidate
    };

    if (!date) return [startTime, endTime];
    startTime.name += '' + date.valueOf();
    startTime.message = 'Enter ' + date + ' start time: ';
    endTime.name += '' + date.valueOf();
    endTime.message = 'Enter ' + date + ' end time(If this is less than start time, this would be exchanged with start date.): ';
    return [startTime, endTime];
}
