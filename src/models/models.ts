export enum PerfType
{
    PHOTO = "PHOTO",
    NAME = "NAME",
    DESC = "DESC",
    ALPHA = "ALPHA"
}

export interface Performance {
    bestTime: number
    avgTime: number
    worstTime: number
    numPresentations: number
    frequency: number
    rank: number
    lastTested: number
    familiarity: number
    frequencyOffsetStart: number
    frequencyOffsetEnd: number
}

export interface QuizSet {
    quizPeople: QuizPerson[]
    frequencyTotal: number
}

export interface QuizPerson {
    blobNames: string[]
    fullName: string
    performance: Performance
}

export interface Tag {
    name: string
    count: number
}

export interface Filter {
    perfType: PerfType
    required: string[],
    blocked: string[]
}
