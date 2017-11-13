var inquirer = require('inquirer');
var validator = require('validator');
var moment = require('moment');

var result = {};

function dateValidate(value) {
    if (validator.isISO8601(value)) return true;
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
            name: moment(startDate).format('YYYY-MM-DD(dddd)'),
            value: moment(startDate).format('YYYY-MM-DD')
        });
        startDate = startDate.add(1, 'days');
    } while (startDate.valueOf() <= endDate.valueOf());
    return result;
}

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
        choices: [
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
        ]
    },
    {
        type: 'checkbox',
        name: 'playDay',
        message: 'Select What day of week you want to play.',
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        choices: [
            new inquirer.Separator(' = Week = '),
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            new inquirer.Separator(' = Weekend = '),
            'Saturday',
            'Sunday'
        ],
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
            'Split',
            'Specific time period'
        ]
    }
];

var timeQuestions = [
    {
        type: 'input',
        name: 'startTime',
        message: 'Enter start time(0~23): ',
        validate: timeValidate
    },
    {
        type: 'input',
        name: 'endTime',
        message: 'Enter end time(0~23): ',
        validate: timeValidate
    }
];

console.log('Start to create an Ad Schedule\n');
inquirer.prompt(questions).then((answers) => {
    console.log(answers);

    if (answers.time === 'workTime') {
        inquirer.prompt(restQuestions).then((restAnswers) => {
            console.log(restAnswers);
        });
    }
});