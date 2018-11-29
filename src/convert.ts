/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import { Person } from "./models/person";
import { PerfType, QuizPerson, Filter, FilterSet, Tag, QuizSet, SortDirection, SortType } from './models/models'
import { MAX_TIME, BIAS } from './models/const'

export function toQuizPerson(person: Person, perfType: PerfType): QuizPerson {
    return {
        guid: person.guid,
        fullName: `${person.firstName} ${person.lastName}`,
        description: person.description,
        blobNames: person.photoFilenames,
        performance: person.performance(perfType),
        } as QuizPerson
}

export function filteredPeople(people: Person[], filter: Filter): Person[] {      
    let filteredPeople: Person[] = []

    if (filter.blocked.length === 0 && filter.required.length === 0) {
        filteredPeople = people.filter(p => {
            // Reject if doesn't have appropriate test data
            return (p.hasTestData(filter.perfType))
        })
    }
    else {
        filteredPeople = people.filter(p => {
            // Reject if doesn't have appropriate test data
            if (!p.hasTestData(filter.perfType)) {
                return false
            }
            let pass = true
            filter.required.forEach(f => {
                    if (!p.tags.find(t => t === f)) {
                        pass = false
                    }
                })
            filter.blocked.forEach(f => { 
                    if (p.tags.find(t => t === f)) {
                        pass = false
                    }
                })
            return pass
        })
    }

    if (filter.sortType === SortType.NAME) {
        // Sort people alphabetically
        filteredPeople = filteredPeople.sort((a, b) => {
            if (a.fullName().toLowerCase() < b.fullName().toLowerCase()) { return -1 }
            else if (b.fullName().toLowerCase() < a.fullName().toLowerCase()) { return 1 }
            else { return 0 }
            })
    } else if (filter.sortType === SortType.FAMILIARITY) {
        // Sort people by performance
        filteredPeople = filteredPeople.sort((a, b) => {
            if (a.photoPerformance.familiarity < b.photoPerformance.familiarity) { return -1 }
            else if (b.photoPerformance.familiarity < a.photoPerformance.familiarity) { return 1 }
            else { return 0 }
            })
    }

    if (filter.sortDirection === SortDirection.DOWN) {
        filteredPeople = filteredPeople.reverse()
    }

    return filteredPeople
}

export function getPerson(people: Person[], guid: string) {
    return people.find(p => p.guid === guid)
} 

export function getFilterSet(people: Person[], filter: Filter, person?: Person): FilterSet
{
    // Filter people by tags
    let filtered = filteredPeople(people, filter)
    let selectedIndex = person ? filtered.findIndex(p => p.guid === person.guid) : 0
    if (selectedIndex < 0) {
        throw new Error("Invalid person in filter")
    }
    return { people: filtered, selectedIndex }
}

export function extractBlockedTags(people: Person[], blockedTags: string[]) : Tag[] {

    let tags: Tag[] = []
    people.map(p => {
        p.tags.map(t => {
            const isBlocked = blockedTags.find(b => b === t)
            if (isBlocked) {
                const tag = tags.find(tag => tag.name === t)
                if(tag) {
                    tag.count++
                }
                else {
                    tags.push({name: t, count: 1})
                } 
            }
        }) 
    })
    return tags
}

export function extractTags(people: Person[]) : Tag[] {

    let tags: Tag[] = []
    people.map(p => {
        p.tags.map(t => {
            const tag = tags.find(tag => tag.name == t)
            if(tag) {
                tag.count++
            }
            else {
                tags.push({name: t, count: 1})
            } 
        }) 
    })
    return tags
}

// Return list of tags in filterd people and blocked tags
export function filteredTags(filteredPeople: Person[], allPeople: Person[], filter: Filter): Tag[] {
    let tags = [...extractTags(filteredPeople), ...extractBlockedTags(allPeople, filter.blocked)]
    tags = tags.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
        else if (b.name.toLowerCase() < a.name.toLowerCase()) return 1
        else return 0
    })
    return tags
}

export function quizSet(people: Person[], filter: Filter): QuizSet
    {
        // Filter people by tags
        let quizPeople = filteredPeople(people, filter).map(p => {
            return toQuizPerson(p, filter.perfType)
        })

        if (quizPeople.length === 0) {
            return {quizPeople: [], frequencyTotal: 0}
        }

        // Find longest and shortest times
        let maxAverageTime  = 0;
        let minAverageTime = MAX_TIME
        quizPeople.forEach(person =>
        {
            // Only for people with at least one presentation
            if (person.performance.numPresentations > 0) {
                const averageTime = person.performance.avgTime
                if (averageTime > maxAverageTime) {
                    maxAverageTime = averageTime
                }
                if (averageTime < minAverageTime) {
                    minAverageTime = averageTime
                }
            }
        })

        quizPeople = quizPeople.sort((a, b) => a.performance.avgTime < b.performance.avgTime ? -1 : a.performance.avgTime > b.performance.avgTime ? 1 : 0)

        //-------------------------------------------
        // Now weight them for appearance in testing
        //-------------------------------------------

        // If very first test set all frequencies to 1
        if (maxAverageTime === 0) 
        {
            quizPeople.forEach(person => {
                person.performance.frequency = 1
            })
        }
        // Caculate the frequency for each
        else
        {
            let newFrequency = Math.ceil(1 + (BIAS * ((maxAverageTime / minAverageTime) - 1)))
                    	
            quizPeople.forEach(person =>
            {
                // If a new person, use largest time
                if (person.performance.numPresentations === 0)
                {
                    person.performance.frequency = newFrequency
                }
                    // Otherwise use average time
                else
                {
                    // Get average time take to respond
                    let avgTime = person.performance.avgTime

                    // Add time based on how long since last tested - max time after 30 days
                    let ageBias = person.performance.ageBias()
                    
                    // Limit to max time
                    avgTime = Math.min(MAX_TIME,(avgTime+ageBias));

                    // Calculate how often this person should appear
                    let frequency = Math.ceil(1 + (BIAS * ((avgTime / minAverageTime) - 1)))

                    person.performance.frequency = frequency
                }
            })
        }

        // Now give each person a range depending on the frequency
        let frequencyTotal = 0

        console.log("--------" + filter.perfType + "--------");
        console.log("HIGH:" + maxAverageTime);
        console.log("LOW:" + minAverageTime);

        let logstrings: string[] = []
        quizPeople.forEach(person =>
        {
            person.performance.frequencyOffsetStart = frequencyTotal 
            person.performance.frequencyOffsetEnd = frequencyTotal + person.performance.frequency
         //LARS TODO   person.performance.Rank = .SetRank(SortType, _Library._selectedPeople.IndexOf(person));
            person.performance.familiarity = calcFamiliarity(minAverageTime, maxAverageTime, person.performance.avgTime)
            frequencyTotal += person.performance.frequency

            logstrings.push(`${person.performance.avgTime + (10 * MAX_TIME)} \t${person.performance.frequency} \t${person.performance.frequencyOffsetStart} \t${person.performance.frequencyOffsetEnd} \t${person.fullName}`)
        })

        logstrings.sort()
        logstrings.forEach(ls => console.log(ls))

        return {
            quizPeople,
            frequencyTotal
        }
    }

    /// Set relative familiarity value, with respect to all people in this category
    export function calcFamiliarity(minAverageTime: number, maxAverageTime:number, myAverageTime: number): number
    {
        // If haven't done any testing
        if (maxAverageTime === minAverageTime)
        {
            return 0.5
        }
        // Otherwise calculate relative to other people
        else
        {
            const totalDiff = maxAverageTime - minAverageTime;
            const myOffset = myAverageTime - minAverageTime;
            return 1 -  (myOffset / totalDiff);
        }
    }


/* lars goes away
export function toDisplayPerson(person: Person): Person {
    let dPerson: Person = JSON.parse(JSON.stringify(person))

    dPerson.relationships = dPerson.relationships.map( r => {
        let sourcePerson = dataProvider.getPerson(r.guid)
        if (sourcePerson) {
            return {...r, name: sourcePerson.fullName()} as Relationship
        }
        else {
            return {...r, name: "MISSING PERSON"} as Relationship
        }
    })
    return dPerson 
}*/
