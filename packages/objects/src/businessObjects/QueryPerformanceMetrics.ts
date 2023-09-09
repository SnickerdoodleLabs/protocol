import { HistogramData, MeterData } from "measured-core";


export class QueryPerformanceMetrics {
    public constructor(
        public eventName : string,
        public meterData : MeterData,
        public histogram: HistogramData,
        public durations : number[]
    ){}
}

