import format from 'date-fns/format';
import endOfWeek from 'date-fns/endOfWeek';
import addWeeks from 'date-fns/addWeeks';
import { PullRequestKeyMetrics, PullRequestWeekActivitySummary, PullRequestActivitySummary } from '../types';
import { weightedMean } from '../stats/weightedMean';

type PullRequestActivityRecord = Record<string, PullRequestWeekActivitySummary>;

const toKey = (date: Date) => format(date, 'yyyy-ww');
const hasWeek = (activityRecord: PullRequestActivityRecord, date: Date): boolean => !!activityRecord[toKey(date)];
const getWeek = (activityRecord: PullRequestActivityRecord, date: Date) => activityRecord[toKey(date)];
const setWeek = (activityRecord: PullRequestActivityRecord, week: PullRequestWeekActivitySummary) => {
  activityRecord[week.weekString] = week;
  return activityRecord;
};

const wipBetween = (acc: PullRequestActivityRecord, startDate: Date, endDate: Date) => {
  const endWeek = endOfWeek(endDate);

  let currentWeek = addWeeks(endOfWeek(startDate), 1);

  while (currentWeek < endWeek && hasWeek(acc, currentWeek)) {
    const week = getWeek(acc, currentWeek);
    if (week) {
      week.wip++;
      acc = setWeek(acc, week);
    }
    currentWeek = addWeeks(currentWeek, 1);
  }

  return acc;
};

const createDataSet = (startDate: Date, endDate: Date): PullRequestActivityRecord => {
  const endWeek = endOfWeek(endDate);

  let currentWeek = endOfWeek(startDate);
  let dataSet: PullRequestActivityRecord = {};

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
      commitToPullRequest: 0,
      daysToFirstReview: 0,
      waitingToDeploy: 0,
      reworkTimeInDays: 0,
    };

    currentWeek = addWeeks(currentWeek, 1);
  }

  return dataSet;
};

export function toWeeklyMetrics(
  pullRequests: PullRequestKeyMetrics[],
  startDate: Date,
  endDate: Date
): PullRequestWeekActivitySummary[] {

  let summary = createDataSet(startDate, endDate);

  summary = pullRequests.reduceRight((acc, pullRequestMetrics) => {
      if (hasWeek(acc, pullRequestMetrics.created) && pullRequestMetrics.state !== 'CLOSED') {
        const createdWeek = getWeek(acc, pullRequestMetrics.created);
        createdWeek.created++;
        createdWeek.pulls.push(pullRequestMetrics);
        acc = setWeek(acc, createdWeek);
      }

      if (pullRequestMetrics.merged && hasWeek(acc, pullRequestMetrics.merged)) {
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
  }, summary);

  return Object.keys(summary).sort().map((key) => {
    const weekSummary = summary[key];
    return {
      ...weekSummary,
      cycleTime: weightedMean(weekSummary.pulls, 'cycleTime'),
      commitToPullRequest: weightedMean(weekSummary.pulls, 'commitToPullRequest'),
      daysToFirstReview: weightedMean(weekSummary.pulls, 'daysToFirstReview'),
      waitingToDeploy: weightedMean(weekSummary.pulls, 'waitingToDeploy'),
      reworkTimeInDays: weightedMean(weekSummary.pulls, 'reworkTimeInDays'),
    };
  })
}
