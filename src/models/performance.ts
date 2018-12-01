/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import { MAX_TIME } from './const'

export class Performance {
    public bestTime = MAX_TIME
    public avgTime = MAX_TIME
    public worstTime = 0
    public numPresentations = 0
    public frequency: number = 0
    public rank = 0
    public lastTested = 0 
    public familiarity = 0
    public frequencyOffsetStart = 0
    public frequencyOffsetEnd = 0

    public constructor(init?: Partial<Performance>) {
        Object.assign(this, init)
    }

    /// Time bias to add to testing frequency based on how long it's been
    /// since this person was tested last
    public ageBias(): number
    {
        // LARS recheck this math
        let millisecondsPassed = Date.now() - this.lastTested
        let daysPassed = (millisecondsPassed / (1000 * 60 * 60 * 24));
        return daysPassed * (MAX_TIME / 30);
    }
}

export interface TestResult {
    saveName: string,
    guid: string,
    result: number
}
