export class StatSummary {
  public constructor(
    public stat: string,
    /**
     * The average rate since the meter was started.
     */
    public mean: number,
    /**
     * The total of all values added to the meter.
     */
    public count: number,
    /**
     * The rate of the meter since the last toJSON() call.
     */
    public currentRate: number,
    /**
     * The rate of the meter biased towards the last 1 minute.
     */
    public oneMinuteRate: number,
    /**
     * The rate of the meter biased towards the last 5 minutes.
     */
    public fiveMinuteRate: number,
    /**
     * The rate of the meter biased towards the last 15 minutes.
     */
    public fifteenMinuteRate: number,
  ) {}
}
