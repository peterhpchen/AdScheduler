'use strict'

var utility = require('./infrastructure/utility');
var moment = require('moment');

var arranger = module.exports = function () {
    this.rawData = {};
};

function getPlayTimePerDay(dates) {
    var result = [],
        rawData = this.rawData,
        time = rawData.time,
        start = 8,
        end = 20;

    if (time === 'specificTime') {
        start = rawData.startTime;
        end = rawData.endTime;
    }

    dates.forEach((date) => {
        if (time === 'specificTimeOnDate') {
            start = rawData['startTime' + date];
            end = rawData['endTime' + date];
        }

        var playTime = {
            date: date,
            start: start > end ? end : start,
            end: end < start ? start : end
        };

        result.push(playTime);
    });

    return result;
}

function getStartTimePerRound(playTimePerDay) {
    var result = [],
        rawData = this.rawData,
        secPerRound = rawData.secPerRound
        ;

    playTimePerDay.forEach((playTime) => {
        var startDateTimePerRound = moment(playTime.date, 'YYYY-MM-DD').hour(playTime.start),
            endDateTime = moment(playTime.date, 'YYYY-MM-DD').hour(playTime.end);

        while (startDateTimePerRound.valueOf() < endDateTime.valueOf()) {
            result.push({
                startDateTimePerRound: moment(startDateTimePerRound, moment.ISO_8601),
                isEnd: false,
                endDateTime: moment(endDateTime, moment.ISO_8601)
            });

            startDateTimePerRound.second(secPerRound);
        }

        result[result.length - 1].isEnd = true;
    });

    return result;
}

function getCompletePlayTime(playTimePerRound) {
    var result = [],
        nthSec = [],
        rawData = this.rawData,
        adCount = rawData.adCount,
        timePeriodInOneRound = rawData.timePeriodInOneRound
        ;

    var pushValue = (rawData, index) => {
        return (rawData.secPerRound / rawData.adCount) * i
    };

    if (timePeriodInOneRound === 'specific') {
        pushValue = (rawData, index) => {
            return rawData['startTimePeriod' + i];
        };
    }

    var i = 0;
    for (; i < adCount; i++) {
        nthSec.push(pushValue.call(null, rawData, i));
    }

    playTimePerRound.forEach((playTime) => {
        var i = 0;
        for (; i < nthSec.length; i++) {
            var sec = nthSec[i],
                time = playTime.startDateTimePerRound.second(sec);

            if (playTime.isEnd && playTime.endDateTime.valueOf() <= time.valueOf()) break;

            result.push(moment(time));
        }
    });

    return result;
}

function arrangeRawDataToTimeArray() {
    var result =
        getCompletePlayTime.call(this,
            getStartTimePerRound.call(this,
                getPlayTimePerDay.call(this,
                    utility.getSelectedDate(this.rawData)
                )
            )
        )
        ;

    return result;
}

function arrangeTimeArrayToSchedule(timeArray) {
    return timeArray;
}

arranger.prototype.setRawData = function (rawData) {
    this.rawData = rawData;
};

arranger.prototype.arrangeDataToSchedule = function () {
    var result =
        arrangeTimeArrayToSchedule.call(this,
            arrangeRawDataToTimeArray.call(this)
        )
        ;

    return result;
};