/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import { MAX_TIME } from './const'

export class Performance {
    bestTime: number;
    avgTime: number;
    worstTime: number;
    numPresentations: number;
    frequency: number;
    rank: number;
    lastTested: number;
    familiarity: number;
    frequencyOffsetStart: number;
    frequencyOffsetEnd: number;

    constructor(init?: Partial<Performance>) {
        this.worstTime = 0;
        this.numPresentations = 0;
        this.frequency = 0;
        this.rank = 0;
        this.lastTested = 0;
        this.familiarity = 0;
        this.frequencyOffsetStart = 0;
        this.frequencyOffsetEnd = 0;
        this.bestTime = MAX_TIME;
        this.avgTime = MAX_TIME;

        Object.assign(this, init);
    }

    /// Time bias to add to testing frequency based on how long it's been
    /// since this person was tested last
    ageBias(): number
    {
        // LARS recheck this math
        let millisecondsPassed = Date.now() - this.lastTested
        let daysPassed = (millisecondsPassed / (1000 * 60 * 60 * 24));
        return daysPassed * (MAX_TIME / 30);
    }
}

export interface TestResult {
    personId: string;
    result: number;
}
