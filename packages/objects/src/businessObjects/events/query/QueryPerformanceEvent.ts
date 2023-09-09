import { EQueryEvents } from "@objects/enum";

/**
 * Important Note on Evaluation Events:
 *
 * The evaluation events also encompass data access events. For instance, if an age evaluation
 * takes 10ms and the corresponding age data access event takes 9ms, then the other processes
 * in the age query approximately consume 1ms.
 *
 * Please be aware that most of our asynchronous operations are CPU-bound. As a result, when
 * performing `Promise.all` on extensive operations, unexpected results may arise. Exercise
 * caution when leveraging these events for large queries.
 */
export class QueryPerformanceEvent {
    constructor(public type: EQueryEvents , public status : `start` | `end` ) {}
  }
  