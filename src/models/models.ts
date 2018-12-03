/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import { Performance } from './performance'
import { Person } from './person'

// Separate stuff needed by server and client into two files LARS
export enum PerfType {
    PHOTO = "PHOTO",
    NAME = "NAME",
    DESC = "DESC",
    ALPHA = "ALPHA"
}

export interface User {
    name: string,
    googleId: string,
    email: string,
    photoBlobPrefix?: string,
    hwmid?: string
    isAdmin?: string
}

export interface QuizSet {
    quizPeople: QuizPerson[]
    frequencyTotal: number
}

export interface QuizPerson {
    saveName: string
    guid: string
    photoBlobnames: string[]
    fullName: string
    description: string
    performance: Performance
}

export interface FilterSet {
    people: Person[]
    selectedIndex: number
}

export interface Tag {
    name: string
    count: number
}

export interface Filter {
    perfType: PerfType
    required: string[]
    blocked: string[]
    sortType: SortType
    sortDirection: SortDirection
}

export enum SortType {
    FAMILIARITY = "FAMILIARITY",
    NAME  = "NAME"
}

export enum SortDirection {
    UP = "UP",
    DOWN = "DOWN"
}

export interface Event {
    id: string
    date?: string
    description: string
    location: string
}

export interface KeyValue {
    key: string
    value: string
}

export enum SocialNetType {
    LINKEDIN = "LINKEDIN",
    FACEBOOK = "FACEBOOK"
}

export interface SocialNet {
    id: string
    URL: string
    profileID: string
    netType: SocialNetType
}
