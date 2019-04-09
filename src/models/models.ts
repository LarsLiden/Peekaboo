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
    tagId?: string // LARS
    name: string
    parentId: string | null
    count: number
}

export interface Filter {
    perfType: PerfType
    requiredTagIds: string[]
    blockedTagIds: string[]
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
    FACEBOOK = "FACEBOOK",
    GOOGLE = "GOOGLE",
    MICROSOFT = "MICROSOFT"
}

export enum SocialNetIcon {
    LINKEDIN = "https://peekaboo.blob.core.windows.net/resources/LI.png",
    FACEBOOK = "https://peekaboo.blob.core.windows.net/resources/FB.png",
    GOOGLE = "https://peekaboo.blob.core.windows.net/resources/GG.png",
    MICROSOFT = "https://peekaboo.blob.core.windows.net/resources/MS.png"
}

export enum SocialNetSearchIcon {
    LINKEDIN = "https://peekaboo.blob.core.windows.net/resources/LI-S.png",
    FACEBOOK = "https://peekaboo.blob.core.windows.net/resources/FB-S.png",
    GOOGLE = "https://peekaboo.blob.core.windows.net/resources/GG-S.png",
    MICROSOFT = "https://peekaboo.blob.core.windows.net/resources/MS-S.png"
}

export enum SocialNetSearch {
    LINKEDIN = "https://www.linkedin.com/search/results/people/?keywords=",
    FACEBOOK = "https://www.facebook.com/search/top/?q=",
    GOOGLE = "https://contacts.google.com/search/",
    MICROSOFT = "http://who/Find.aspx?q=" //frank&jumpToExact=false
}

export interface SocialNet {
    socialNetId: string
    URL: string
    profileID: string
    netType: SocialNetType
}
