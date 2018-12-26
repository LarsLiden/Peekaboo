/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import { Performance } from "./performance";
import { Relationship } from "./relationship"
import { PerfType, Event, KeyValue, SocialNet } from './models'

export class Person {
    photoFilenames: string[] = []
    tags: string[] = []   
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
    lastName: string = ""
    fullMaidenName: string = ""
    fullNickName: string = ""
    alternateName: string = ""
    fullAternateName: string = ""
    personId: string | null = null
    descriptionWithKeyValues: string = ""
    allKeyValues: string = ""
    description: string = ""
    creationDate: number | string = ""

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

    public fullName() {
        return `${this.firstName} ${this.lastName}`
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