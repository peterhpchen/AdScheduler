'use strict'

var validator = require('validator');
var moment = require('moment');

var inquirerValidator = module.exports;

inquirerValidator.dateValidate = function (value) {
    if (moment(value, 'YYYY-MM-DD', true).isValid()) return true;
    return 'Please enter a valid date(YYYY-MM-DD)';
};

inquirerValidator.endDateValidate = function (value, answers) {
    var dateValidateResult = inquirerValidator.dateValidate(value);
    var startDate = answers.startDate;

    if (typeof dateValidateResult != 'boolean') return dateValidateResult;
    if (validator.isAfter(value, startDate)) return true;
    if (validator.toDate(value).valueOf() == validator.toDate(startDate).valueOf()) return true;
    return 'Please enter a valid date(YYYY-MM-DD) which is after start date'
};

inquirerValidator.intValidate = function (value) {
    if (Number.isInteger(value)) return true;
    if (validator.isInt(value)) return true;
    return 'Please enter a integer';
};

/**
 * 在一輪中第n次投放的問題驗證
 * (因欲檢查的問題答案adTime, adCount, secPerRound不在此輪的問題中, 需要個別傳入)
 * @param {*} adTime - 廣告秒數(用bind從Questions傳入)
 * @param {*} adCount - 一輪中廣告投放次數(用bind從Questions傳入) 
 * @param {*} secPerRound - 一輪的秒數(用bind從Questions傳入) 
 * @param {*} value - 欲檢查的輸入值(Inquirer.js參數)
 * @param {*} answers - 之前問題的答案(Inquirer.js參數)
 */
inquirerValidator.timePeriodValidate = function (adTime, adCount, secPerRound, value, answers) {
    var intValidateResult = inquirerValidator.intValidate(value);
    if (typeof intValidateResult != 'boolean') return intValidateResult;

    if (value < 0 || value + adTime > secPerRound) return 'Out of range(0~' + secPerRound + ')';

    var i = 0;
    for (; i < adCount; i++) {
        var currentTimePeriod = answers['startTimePeriod' + i];
        if (currentTimePeriod !== 0 && !currentTimePeriod) break;

        if (currentTimePeriod >= value + adTime) continue;
        if (currentTimePeriod + adTime <= value) continue;
        return 'Time period can not duplicate';
    }
    return true;
};

inquirerValidator.timeValidate = function (value) {
    var intValidateResult = inquirerValidator.intValidate(value);
    if (typeof intValidateResult != 'boolean') return intValidateResult;
    if (value < 0 || value > 23) return 'Please enter valid time(0~23)';
    return true;
};

inquirerValidator.adTimeValidate = function (value, answers) {
    var intValidateResult = inquirerValidator.intValidate(value);
    if (typeof intValidateResult != 'boolean') return intValidateResult;
    if (answers.secPerRound <= value) return 'Ad time can not more than round';
    return true;
};

inquirerValidator.adCountValidate = function (value, answers) {
    var intValidateResult = inquirerValidator.intValidate(value);
    if (typeof intValidateResult != 'boolean') return intValidateResult;
    if (answers.secPerRound <= value * answers.adTime) return 'Ad time multi Ad count can not more than round';
    return true;
};