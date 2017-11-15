'use strict';

var inquirer = require('inquirer');
var extend = require('node.extend');

var scheduler = require('./lib/scheduler');
var arranger = require('./lib/arranger');
var exporter = require('./lib/exporter');
var inquirerQuestion = require('./lib/inquirer/question');
var utility= require('./lib/infrastructure/utility');

var result = {};

console.log('Start to create an Ad Schedule');

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
    
    var time = answers.time;
    
    if (time === 'workTime') return inquirer.prompt([]);
    if (time === 'specificTime') return inquirer.prompt(inquirerQuestion.timeQuestions());
    if (time === 'specificTimeOnDate') {
        var dates = utility.getSelectedDate(answers).sort();

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
    var adScheduler = new scheduler(consoleDataArranger, excelExporter, result);

    adScheduler.arrange();
    adScheduler.output();
}

inquirer.prompt(inquirerQuestion.mainQuestions).then(askTimeQuestion).then(askRestQuestion).then(askTimePeriodQuestion).then(outputAdScheduler);