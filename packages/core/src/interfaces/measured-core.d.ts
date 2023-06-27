/**
 * Everything in this file is sourced from the [measured readme]{@link https://github.com/felixge/node-measured}
 */
declare module "measured-core" {
  /**
   * Values that can be read instantly.
   *
   * Gauges take a function as parameter which needs to return their current value.
   */
  export class Gauge implements IMetric {
    getType(): "Gauge";
    constructor(callback: () => number);

    /**
     * Gauges directly return their currently value.
     */
    public toJSON(): number;
  }

  /**
   * Things that increment or decrement.
   */
  export class Counter implements IMetric {
    getType(): "Counter";
    /**
     * @param properties
     */
    constructor(properties?: CounterProperties);

    /**
     * Increment the counter by n. Defaults to 1.
     * @param n
     */
    public inc(n?: number): void;

    /**
     * Decrement the counter by n. Defaults to 1.
     * @param n
     */
    public dec(n?: number): void;

    /**
     * Resets the counter back to count Defaults to 0.
     * @param count
     */
    public reset(count?: number): void;

    /**
     * Counters directly return their currently value.
     */
    public toJSON(): number;
  }

  /**
   * Properties to create a [Counter]{@see Counter} with.
   */
  export class CounterProperties {
    /**
     * count An initial count for the counter. Defaults to 0.
     */
    public count: number;
  }

  /**
   * Things that are measured as events / interval. Example:
   */
  export class Meter implements IMetric {
    getType(): "Meter";
    /**
     * rateUnit The rate unit. Defaults to 1000 (1 sec).
     * tickInterval The interval in which the averages are updated. Defaults to 5000 (5 sec).
     * @param properties
     */
    constructor(properties?: MeterProperties);

    /**
     * Register n events as having just occured. Defaults to 1.
     * @param n
     */
    public mark(n: number): void;

    /**
     * Resets all values. Meters initialized with custom options will be reset to the default settings (patch welcome).
     */
    public reset(): void;

    /**
     * Unrefs the backing timer. The meter will not keep the event loop alive. Idempotent.
     */
    public unref(): void;

    /**
     * Refs the backing timer again. Idempotent.
     */
    public ref(): void;

    /**
     * toJSON Output
     *
     * <li> mean: The average rate since the meter was started.
     * <li> count: The total of all values added to the meter.
     * <li> currentRate: The rate of the meter since the last toJSON() call.
     * <li> 1MinuteRate: The rate of the meter biased towards the last 1 minute.
     * <li> 5MinuteRate: The rate of the meter biased towards the last 5 minutes.
     * <li> 15MinuteRate: The rate of the meter biased towards the last 15 minutes.
     *
     * @return
     */
    public toJSON(): MeterData;
  }

  export interface MeterData {
    /**
     * The average rate since the meter was started.
     */
    mean: number;
    /**
     * The total of all values added to the meter.
     */
    count: number;
    /**
     * The rate of the meter since the last toJSON() call.
     */
    currentRate: number;
    /**
     * The rate of the meter biased towards the last 1 minute.
     */
    "1MinuteRate": number;
    /**
     * The rate of the meter biased towards the last 5 minutes.
     */
    "5MinuteRate": number;
    /**
     * The rate of the meter biased towards the last 15 minutes.
     */
    "15MinuteRate": number;
  }

  /**
   * Properties to create a [Meter]{@see Meter} with.
   */
  export class MeterProperties {
    /**
     * The rate unit. Defaults to 1000 (1 sec).
     */
    public rateUnit: number;

    /**
     * The interval in which the averages are updated. Defaults to 5000 (5 sec).
     */
    public tickInterval: number;
  }

  /**
   * Keeps a resevoir of statistically relevant values biased towards the last 5 minutes to explore their distribution.
   *
   * {@link https://github.com/felixge/node-measured#histogram}
   */
  export class Histogram implements IMetric {
    getType(): "Histogram";
    /**
     * @param properties
     */
    constructor(properties?: HistogramProperties);

    /**
     * Pushes value into the sample. timestamp defaults to Date.now().
     * @param value
     * @param timestamp
     */
    public update(value: number, timestamp?: Date): void;

    /**
     * Whether the histogram contains values.
     * @return
     */
    public hasValues(): boolean;

    /**
     * Resets all values. Histograms initialized with custom options will be reset to the default settings (patch welcome).
     */
    public reset(): void;

    /**
     * toJSON output:
     *
     * <li> min: The lowest observed value.
     * <li> max: The highest observed value.
     * <li> sum: The sum of all observed values.
     * <li> variance: The variance of all observed values.
     * <li> mean: The average of all observed values.
     * <li> stddev: The stddev of all observed values.
     * <li> count: The number of observed values.
     * <li> median: 50% of all values in the resevoir are at or below this value.
     * <li> p75: See median, 75% percentile.
     * <li> p95: See median, 95% percentile.
     * <li> p99: See median, 99% percentile.
     * <li> p999: See median, 99.9% percentile.
     *
     * @return
     */
    public toJSON(): HistogramData;
  }

  export interface HistogramData {
    /**
     * The lowest observed value.
     */
    min: number | null;
    /**
     * The highest observed value.
     */
    max: number | null;
    /**
     * The sum of all observed values.
     */
    sum: number | null;
    /**
     * The variance of all observed values.
     */
    variance: number | null;
    /**
     * The average of all observed values.
     */
    mean: number | null;
    /**
     * The stddev of all observed values.
     */
    stddev: number | null;
    /**
     * The number of observed values.
     */
    count: number;
    /**
     * 50% of all values in the resevoir are at or below this value.
     */
    median: number;
    /**
     * See median, 75% percentile.
     */
    p75: number;
    /**
     * See median, 95% percentile.
     */
    p95: number;
    /**
     * See median, 99% percentile.
     */
    p99: number;
    /**
     * See median, 99.9% percentile.
     */
    p999: number;
  }

  /**
   * Properties to create a [Histogram]{@see Histogram} with.
   */
  export class HistogramProperties {
    /**
     * The sample resevoir to use. Defaults to an ExponentiallyDecayingSample.
     */
    public sample: object;
  }

  /**
   * Timers are a combination of Meters and Histograms. They measure the rate as well as distribution of scalar events.
   * Since they are frequently used for tracking how long certain things take, they expose an API for that:
   *
   * {@see https://github.com/felixge/node-measured#timers}
   */
  export class Timer implements IMetric {
    getType(): "Timer";
    /**
     * @param properties
     */
    constructor(properties?: TimerProperties);

    /**
     * @return Returns a Stopwatch that has been started.
     */
    public start(): StopWatch;

    /**
     *  Updates the internal histogram with value and marks one event on the internal meter.
     * @param value
     */
    public update(value: number): void;

    /**
     * Resets all values. Timers initialized with custom options will be reset to the default settings.
     */
    public reset(): void;

    /**
     * Unrefs the backing timer. The meter will not keep the event loop alive. Idempotent.
     */
    public unref(): void;

    /**
     * Refs the backing timer again. Idempotent.
     */
    public ref(): void;

    /**
     * toJSON output:
     *
     * <li> meter: {@see Meter} toJSON output docs above.
     * <li> histogram: {@see Histogram} toJSON output docs above.
     *
     * @return
     */
    public toJSON(): { meter: MeterData; histogram: HistogramData };
  }

  /**
   * Properties to create a [Timer]{@see Timer} with.
   */
  export class TimerProperties {
    /**
     * The internal meter to use. Defaults to a new Meter.
     * {@see Meter}
     */
    public meter: Meter;

    /**
     * The internal histogram to use. Defaults to a new Histogram.
     * {@see Histogram}
     */
    public histogram: Histogram;
  }

  /**
   * Created by the Timer Metric when start() is called
   */
  export class StopWatch {
    /**
     * Called to mark the end of the timer task
     * @return the total execution time
     */
    public end(): number;
  }

  /**
   * Creates a collection that can create and keep track of metrics
   */
  export const createCollection: (name?: string) => Collection;

  /**
   * Collection class that keeps track of Metrics that it has created
   *
   * @param name Optional name to use for the collection
   */
  export class Collection<TName extends undefined | string = undefined> {
    public name: TName;

    /**
     * Note: This is technically private but you may prefer to use this vs toJSON to iterate metrics.  From my reading of the code, I see no reason not to
     */
    public _metrics: Record<string, IMetric>;

    constructor(name?: TName);

    /**
     * {@see https://github.com/felixge/node-measured/blob/master/lib/Collection.js}
     * @return JSON object with all the metrics in the collection
     */
    public toJSON(): TName extends string
      ? { [key in TName]: Record<string, unknown> }
      : Record<string, unknown>;

    /**
     * Iterates through the metrics in the collection and
     * calls end() in the metric, if the metric has an end() method.
     */
    public end(): void;

    /**
     * Creates a new Gauge and registers it with the metrics collection
     *
     * {@see Gauge}
     *
     * @param callback
     * @return
     */
    public guage(callback: () => number): Gauge;

    /**
     * Creates a new Counter and registers it with the metrics collection
     *
     * {@see Counter}
     *
     * @param properties optional counter properties.
     * @return
     */
    public counter(properties?: CounterProperties): Counter;

    /**
     * Creates a new Meter and registers it with the metrics collection
     *
     * {@see Meter}
     *
     * @param properties
     * @return
     */
    public meter(properties?: MeterProperties): Meter;

    /**
     * Creates a new Histogram and registers it with the metrics collection
     *
     * {@see Histogram}
     *
     * @param properties
     * @return
     */
    public histogram(properties?: HistogramProperties): Histogram;

    /**
     * Creates a new Timer and registers it with the metrics collection
     *
     * {@see Timer}
     *
     * @param properties
     * @return
     */
    public timer(properties?: TimerProperties): Timer;

    /**
     * register a metric that was created outside the provided convenience methods of this collection
     * @param name The metric name
     * @param metric The {@link IMetric} implementation
     * @example
     * var { Collection, Gauge } = require('measured');
     * const collection = new Collection('node-process-metrics');
     * const gauge = new Gauge(() => {
     *    return process.memoryUsage().heapUsed;
     * });
     * collection.register('node.process.heap_used', gauge);
     */
    public register(name: string, metric: IMetric): void;
  }

  /**
   * All metrics implement toJSON()
   */
  export interface IMetric {
    getType(): string;
    /**
     * See the toJSON metric of the implementing classes
     * @return
     */
    toJSON(): unknown;
  }
}
