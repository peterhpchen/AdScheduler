'use strict'

var XLSX = require('xlsx');

var templateConfig = require('./../config/templateConfig');
var basicInfo = require('./../template/excel/basicInfo');

var exporter = module.exports = function () {

}

exporter.prototype.outputReport = function (shedule) {
    var wb = XLSX.readFile(templateConfig.templatePath.excel);
    
    //wb.Sheets.sample.F2.v = 'hihihi';
    console.log(wb.Sheets.sample.F2);
    
    console.log(XLSX.writeFile(wb, 'hihi.xls'));
}