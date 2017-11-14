'use strict';

var inquirer = require('inquirer');
var moment = require('moment');
var extend = require('node.extend');

var scheduler = require('./lib/scheduler');
var arranger = require('./lib/arranger');
var exporter = require('./lib/exporter');
var inquirerValidator = require('./lib/inquirer/validator');
var inquirerChoice = require('./lib/inquirer/choice');
var inquirerQuestion = require('./lib/inquirer/question');
var utility= require('./lib/infrastructure/utility');

var result = {};


console.log('Start to create an Ad Schedule\n');

function getDateByDayOfWeek(startDate, endDate, dayOfWeek) {
    var week = utility.getWeekInfo(startDate, endDate);
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

    var questions = inquirerQuestion.timePeriodQuestions(adTime, adCount, secPerRound);
    return inquirer.prompt(questions);
}

function askRestQuestion(answers) {
    result = extend(result, answers);
    return inquirer.prompt(inquirerQuestion.restQuestions);
}

function askTimeQuestion(answers) {
    result = extend({}, answers);
    if (answers.time === 'workTime') return inquirer.prompt([]);
    if (answers.time === 'specificTime') return inquirer.prompt(inquirerQuestion.timeQuestions());
    if (answers.time === 'specificTimeOnDate') {
        var dates = getSelectedDate(answers).sort();

        var timeQuestions = [];
        dates.forEach((date) => {
            timeQuestions = timeQuestions.concat(inquirerQuestion.timeQuestions(date));
        });

        return inquirer.prompt(timeQuestions);
    }
}

function outputAdScheduler(answers) {
    result = extend(result, answers);
    var consoleDataArranger = new arranger();
    var excelExporter = new exporter();
    var adScheduler = new scheduler(consoleDataArranger, excelExporter);
    adScheduler.arrange(result);
    adScheduler.output();
}

inquirer.prompt(inquirerQuestion.mainQuestions).then(askTimeQuestion).then(askRestQuestion).then(askTimePeriodQuestion).then(outputAdScheduler);