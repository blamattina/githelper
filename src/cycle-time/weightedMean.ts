import { PullRequestKeyMetrics, PullRequestKeyMetricsNames } from './types';
export type DataPoint = {
  value: number;
  weight: number;
};

export type Metric = keyof PullRequestKeyMetrics;

const calculateWeight = (pullRequestMetrics: PullRequestKeyMetrics) =>
  pullRequestMetrics.additions + pullRequestMetrics.deletions;

export function weightedMean(
  metrics: PullRequestKeyMetrics[],
  metricName: PullRequestKeyMetricsNames
): number {
  const totalWeight = metrics.reduce(
    (total: number, dataPoint: PullRequestKeyMetrics) => {
      if (metricName in dataPoint) {
        return total + calculateWeight(dataPoint);
      }

      return total;
    },
    0
  );

  return metrics.reduce((mean: number, dataPoint: PullRequestKeyMetrics) => {
    const metricValue = dataPoint[metricName] as number | undefined;
    if (typeof metricValue === 'undefined') return mean;

    return mean + (metricValue * calculateWeight(dataPoint)) / totalWeight;
  }, 0);
}
