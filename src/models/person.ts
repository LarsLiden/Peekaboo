/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import { Performance } from "./performance";
import { Relationship } from "./relationship"
import { PerfType, Event, KeyValue, SocialNet, Tag } from './models'

export class Person {
    photoFilenames: string[] = []
    temptags: string[] = []    // LARS REMOVE
    tagIds: string[] = []
    keyValues: KeyValue[] = []
    photoPerformance: Performance = new Performance()
    namePerformance: Performance = new Performance()
    descPerformance: Performance = new Performance()
    socialNets: SocialNet[] = []
    events: Event[]  = [] 
    relationships: Relationship[] = []
    nickName: string = ""
    maidenName: string = ""
    isArchived: boolean = false
    firstName: string = ""
    firstPhonetic: string = ""
    lastName: string = ""
    lastPhonetic: string = ""
    fullMaidenName: string = ""
    fullNickName: string = ""
    alternateName: string = ""
    fullAternateName: string = ""
    personId: string | null = null
    description: string = ""
    creationDate: number | string = ""
    searchCache?: string | null
    
    public constructor(init?: Partial<Person>) {
        Object.assign(this, init)

        if (init) {
            this.photoPerformance = new Performance(init.photoPerformance)
            this.namePerformance = new Performance(init.namePerformance)
            this.descPerformance = new Performance(init.descPerformance)
        } else {
            this.photoPerformance = new Performance()
            this.namePerformance = new Performance()
            this.descPerformance = new Performance()
        }
    }

    public fullName(): string {
        return `${this.firstName} ${this.lastName}`
    }

    public expandedName(): string {
        return `${this.firstName} ${this.nickName ? `"${this.nickName}"` : ""} ${this.lastName} ${this.maidenName ? `(${this.maidenName})` : ""}`
    }

    public phoneticName(): string {
        if (!this.firstPhonetic && !this.lastPhonetic) {
            return ""
        } 
        return `${this.firstPhonetic} ${this.lastPhonetic}`
    }

    public get getKey(): string {
        return this.personId![0].toUpperCase()
    } 

    public performance(perfType: PerfType): Performance {
        switch (perfType) {
            case PerfType.PHOTO: 
                return new Performance(this.photoPerformance)
            case PerfType.DESC:
                return new Performance(this.descPerformance)
            case PerfType.NAME:
                return new Performance(this.namePerformance)
            default:
                throw new Error("Invalid Performance Type")
        }
        throw new Error("invalid perfType")
    }

    public searchNames(): string {
        return `${this.firstName} ${this.lastName} ${this.nickName} ${this.maidenName} ${this.alternateName}`
    }

    public searchData(allPeople: Person[], allTags: Tag[]): string {
        if (!this.searchCache) {
            const keyValues = this.keyValues.map(k => k.value).join(' ')
            const relationships = this.relationships.map(r => {
                const person = allPeople.find(p => p.personId === r.personId)
                return (person ? person.searchNames() : r.personId.split("_")[0])
            }).join(' ')
            const events = this.events.map(e => e.description).join(' ')
            const tags = this.tagIds.map(id => allTags.find(t => t.tagId === id)).join(' ')
            this.searchCache = `${this.searchNames()} ${this.description} ${keyValues} ${relationships} ${events} ${tags}`.toUpperCase()
        }

        return this.searchCache
    }
    // Does person have data to take test type?
    public hasTestData(perfType: PerfType): boolean {
        // TODO: separate function for actual testing
        return true
        /*
        // Excluce people that don't have data for test type
        switch (perfType)
        {
            case PerfType.PHOTO:
                return (this.photoFilenames.length > 0);
            case PerfType.NAME:
                return (this.fullName() != "");
            case PerfType.DESC:
                return (this.description != "");
            case PerfType.ALPHA:
                return true;
        }
        return false;*/
    }
    
}