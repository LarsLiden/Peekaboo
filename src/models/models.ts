/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import { Performance } from './performance'
import { Person } from './person'
import { Relationship } from './relationship';

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
    isAdmin?: boolean
    isNew?: boolean
    isSpoof?: boolean
    numPeople?: number
    numPhotos?: number,
    numTestResults?: number
}

export interface QuizSet {
    quizPeople: QuizPerson[]
    frequencyTotal: number
}

export interface QuizPerson {
    personId: string
    photoBlobnames: string[]
    expandedName: string
    description: string
    tags: string
    topRelationships: Relationship[]
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
    searchTerm: string | null
    sortType: SortType
    sortDirection: SortDirection
}

export enum SortType {
    FAMILIARITY = "FAMILIARITY",
    NAME  = "NAME",
    CREATION = "CREATION"
}

export enum SortDirection {
    UP = "UP",
    DOWN = "DOWN"
}

export interface Event {
    eventId: string
    date?: string
    description: string
    location: string
}

export interface KeyValue {
    keyValueId: string
    key: string
    value: string
}

export enum SocialNetType {
    LINKEDIN = "LINKEDIN",
    FACEBOOK = "FACEBOOK"
}

export interface SocialNet {
    socialNetId: string
    URL: string
    profileID: string
    netType: SocialNetType
}
