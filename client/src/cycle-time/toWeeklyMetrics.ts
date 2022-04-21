import format from 'date-fns/format';
import endOfWeek from 'date-fns/endOfWeek';
import addWeeks from 'date-fns/addWeeks';
import { PullRequestKeyMetrics } from './types';
import { weightedMean } from '../stats/weightedMean';

const getWeek = (acc, date) => {
  const weekString = format(date, 'yyyy-ww');
  return acc[weekString];
};

const setWeek = (acc, week) => {
  acc[week.weekString] = week;
  return acc;
};

const wipBetween = (acc, startDate, endDate) => {
  const endWeek = endOfWeek(endDate);

  let currentWeek = addWeeks(endOfWeek(startDate), 1);

  while (currentWeek < endWeek) {
    const week = getWeek(acc, currentWeek);
    if (week) {
      week.wip++;
      acc = setWeek(acc, week);
    }
    currentWeek = addWeeks(currentWeek, 1);
  }

  return acc;
};

const createDataSet = (startDate, endDate) => {
  const endWeek = endOfWeek(endDate);

  let currentWeek = endOfWeek(startDate);
  let dataSet = {};

  while (currentWeek <= endWeek) {
    const weekString = format(currentWeek, 'yyyy-ww');
    const name = format(currentWeek, 'MM-dd-yy');
    dataSet[weekString] = {
      name,
      weekString,
      created: 0,
      merged: 0,
      wip: 0,
      closed: 0,
      pulls: [],
      cycleTime: 0,
    };

    currentWeek = addWeeks(currentWeek, 1);
  }

  console.log(dataSet);

  return dataSet;
};

export function toWeeklyMetrics(
  pullRequests: PullRequestKeyMetrics[],
  startDate: Date,
  endDate: Date
) {
  return Object.values(
    [...pullRequests]
      .reverse()
      .reduce((acc: Record<string, any>, pullRequestMetrics: any) => {
        if (pullRequestMetrics.state !== 'CLOSED') {
          const createdWeek = getWeek(acc, pullRequestMetrics.created);
          if (!createdWeek) {
            console.log(pullRequestMetrics, 'could not be indexed');
            debugger;
          }
          createdWeek.created++;
          createdWeek.pulls.push(pullRequestMetrics);
          acc = setWeek(acc, createdWeek);
        }

        if (pullRequestMetrics.merged) {
          acc = wipBetween(
            acc,
            pullRequestMetrics.created,
            pullRequestMetrics.merged
          );
          const mergeWeek = getWeek(acc, pullRequestMetrics.merged);
          if (mergeWeek) {
            mergeWeek.merged++;
            acc = setWeek(acc, mergeWeek);
          }
        }
        return acc;
      }, createDataSet(startDate, endDate))
  ).map((dataPoint) => {
    return {
      ...dataPoint,
      cycleTime: weightedMean(dataPoint.pulls, 'cycleTime'),
      commitToPullRequest: weightedMean(dataPoint.pulls, 'commitToPullRequest'),
      daysToFirstReview: weightedMean(dataPoint.pulls, 'daysToFirstReview'),
      waitingToDeploy: weightedMean(dataPoint.pulls, 'waitingToDeploy'),
      reworkTimeInDays: weightedMean(dataPoint.pulls, 'reworkTimeInDays'),
    };
  });
}
