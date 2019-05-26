/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import { Person } from "./models/person";
import { Relationship } from "./models/relationship"
import { PerfType, QuizPerson, Filter, FilterSet, Tag, QuizSet, SortDirection, SortType } from './models/models'
import { getPhotoBlobName } from './Util'
import { MAX_TIME, BIAS } from './models/const'

export function toQuizPerson(person: Person, perfType: PerfType, userPersonId: string | null, allTags: Tag[]): QuizPerson {

    const tags = person.tagIds.map(id => {
            let tag = allTags.find(t => t.tagId === id)
            return tag ? tag.name : "MISSING_TAG"
        }).join(", ")

    return {
        personId: person.personId!,
        expandedName: person.expandedName(),
        phoneticName: person.phoneticName(),
        description: person.description,
        tags,
        topRelationships: topRelationships(person, userPersonId),
        photoBlobnames: person.photoFilenames.map(f => getPhotoBlobName(person, f)),
        performance: person.performance(perfType),
    }
}

// Return top relationships
export function topRelationships(person: Person, userPersonId: string | null): Relationship[] {

    // Next get by priority
    let relationships = person.relationships.sort((a, b) => {
        // Relationships to user are most important
        const aVal = a.personId === userPersonId ? 0 : a.type.priority
        const bVal = b.personId === userPersonId ? 0 : b.type.priority
        if (aVal < bVal) { return -1 }
        else if (bVal < aVal) { return 1 }
        else { return 0 }
        })

    return relationships.slice(0, 4)
}

export function expandTagIds(tagIds: string[], allTags: Tag[]): string[] {
    let expandedIds: string[] = []
    let todoIds = [...tagIds]
    while (todoIds.length > 0) {
        let tagId = todoIds.pop()
        expandedIds.push(tagId!)
        let tag = allTags.find(t => t.tagId === tagId)
        if (!tag) {
            console.log("Missing Tag")
        }
        else {
            if (tag.parentId) {
                todoIds.push(tag.parentId)
            }
        }
    }
    return expandedIds
}
export function filterPeople(people: Person[], allTags: Tag[], filter: Filter): Person[] {      
    let filteredPeople: Person[] = []

    if (filter.blockedTagIds.length === 0 && filter.requiredTagIds.length === 0 && filter.searchTerm === null) {
        filteredPeople = people.filter(p => {
            // TODO: ONLY call this when getting people for TEST
            // Until that's fixed always return true
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

            let expandIds = expandTagIds(p.tagIds, allTags)
            filter.requiredTagIds.forEach(f => {
                    if (!expandIds.find(t => t === f)) {
                        pass = false
                    }
                })
            filter.blockedTagIds.forEach(f => { 
                    if (expandIds.find(t => t === f)) {
                        pass = false
                    }
                })
            if (filter.searchTerm) {
                if (p.searchData(people, allTags).indexOf(filter.searchTerm) < 0) {
                    pass = false
                }
            }
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
            if (a.photoPerformance.avgTime < b.photoPerformance.avgTime) { return -1 }
            else if (b.photoPerformance.avgTime < a.photoPerformance.avgTime) { return 1 }
            else { return 0 }
            })
    } else if (filter.sortType === SortType.CREATION) {
        // Sort people by performance
        filteredPeople = filteredPeople.sort((a, b) => {
            if (a.creationDate < b.creationDate) { return -1 }
            else if (b.creationDate < a.creationDate) { return 1 }
            else { return 0 }
            })
    }

    if (filter.sortDirection === SortDirection.DOWN) {
        filteredPeople = filteredPeople.reverse()
    }

    return filteredPeople
}

export function getPerson(people: Person[], personId: string) {
    return people.find(p => p.personId === personId)
} 

export function getFilterSet(people: Person[], allTags: Tag[], filter: Filter, selectedPerson: Person | null): FilterSet {
    // Filter people by tags
    let filtered = filterPeople(people, allTags, filter)
    let selectedIndex = selectedPerson ? filtered.findIndex(p => p.personId === selectedPerson.personId) : 0
    // If selected person isn't in filter, select first person in filter
    if (selectedIndex < 0) {
        selectedIndex = 0
    }
    return { people: filtered, selectedIndex }
}

export function extractBlockedTags(people: Person[], allTags: Tag[], blockedTags: string[]): Tag[] {

    let tags: Tag[] = []
    people.map(p => {
        let expandedIds = expandTagIds(p.tagIds, allTags)
        expandedIds.map(tagId => {
            const isBlocked = blockedTags.find(bid => bid === tagId)
            if (isBlocked) {
                const tag = tags.find(t => t.tagId === tagId)
                if (tag) {
                    tag.count = tag.count + 1
                }
                else {
                    const newTag = allTags.find(t => t.tagId === tagId)
                    if (newTag) {
                        tags.push({...newTag, count: 1})  
                    }
                    else {
                        console.log(`ERROR: Can't find tag ${tagId}`)
                    }
                } 
            }
        }) 
    })
    return tags
}

/* NOT USED
export function extractAllTags(people: Person[], allTags: Tag[]): Tag[] {

    let tags: Tag[] = allTags.map(t => { return {...t, count: 0 }})
    people.map(p => {
        p.tagIds.map(tagId => {
            const tag = tags.find(t => t.tagId === tagId)
            if (tag) {
                tag.count = tag.count + 1
            }
            else {
                const newTag = allTags.find(t => t.tagId === tagId)
                if (newTag) {
                    tags.push({...newTag, count: 1})
                }
                else {
                    console.log(`ERROR: Can't find tag ${tagId}`)
                }
            } 
        }) 
    })
    return tags
}
*/

export function extractTags(people: Person[], allTags: Tag[], usedOnly: boolean): Tag[] {

    let tags: Tag[] = usedOnly 
        ? []
        : allTags.map(t => { return {...t, count: 0 }})

    people.map(p => {
        let expandedIds = expandTagIds(p.tagIds, allTags)
        expandedIds.map(tagId => {
            const tag = tags.find(t => t.tagId === tagId)
            if (tag) {
                tag.count = tag.count + 1
            }
            else {
                const newTag = allTags.find(t => t.tagId === tagId)
                if (newTag) {
                    tags.push({...newTag, count: 1})
                }
                else {
                    console.log(`ERROR: Can't find tag ${tagId}`)
                }
            } 
        }) 
    })
    return tags
}

export function sortTags(tags: Tag[]) {
    // First sort
    let parentTags = tags.filter(t => !t.parentId)
    parentTags = parentTags.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1 }
        else if (b.name.toLowerCase() < a.name.toLowerCase()) { return 1 }
        else { return 0 }
    })
    let remainingTags = tags.filter(t => t.parentId)
    let depth = 0 // Max depth to prevent endless loop in case of bad data
    while (remainingTags.length) {
        depth = depth + 1
        let notFound: Tag[] = []
        remainingTags.forEach(child => {
            let index = parentTags.findIndex(t => t.tagId === child.parentId)
            if (index === -1) {
                notFound.push(child)
            } 
            else {
                parentTags.splice(index + 1, 0, child)
            }
        })
        remainingTags = [...notFound]
        if (depth === 10) {
            throw Error("Invalid Tag depth")
        }
    }
    return parentTags
}

// Return list of tags in filterd people and blocked tags
export function filterTags(filteredPeople: Person[], allPeople: Person[], allTags: Tag[], filter: Filter): Tag[] {
    let tags = (filteredPeople.length === allPeople.length)
        ? [...extractTags(filteredPeople, allTags, false)]
        : [...extractTags(filteredPeople, allTags, true), ...extractBlockedTags(allPeople, allTags, filter.blockedTagIds)]
    tags = tags.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1 }
        else if (b.name.toLowerCase() < a.name.toLowerCase()) { return 1 }
        else { return 0 }
    })
    return tags
}

export function quizSet(people: Person[], allTags: Tag[], filter: Filter, userPersonId: string | null): QuizSet {
        // Filter people by tags
        let quizPeople = filterPeople(people, allTags, filter)
            .filter(p => p.photoFilenames.length > 0)
            .map(p => {return toQuizPerson(p, filter.perfType, userPersonId, allTags)})

        if (quizPeople.length === 0) {
            return {quizPeople: [], frequencyTotal: 0}
        }

        // Find longest and shortest times
        let maxAverageTime  = 0;
        let minAverageTime = MAX_TIME
        quizPeople.forEach(person => {
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
        if (maxAverageTime === 0) {
            quizPeople.forEach(person => {
                person.performance.frequency = 1
            })
        }
        // Caculate the frequency for each
        else {
            let newFrequency = Math.ceil(1 + (BIAS * ((maxAverageTime / minAverageTime) - 1)))
                    	
            quizPeople.forEach(person => {
                // If a new person, use largest time
                if (person.performance.numPresentations === 0) {
                    person.performance.frequency = newFrequency
                }
                    // Otherwise use average time
                else {
                    // Get average time take to respond
                    let avgTime = person.performance.avgTime

                    // Add time based on how long since last tested - max time after 30 days
                    let ageBias = person.performance.ageBias()
                    
                    // Limit to max time
                    avgTime = Math.min(MAX_TIME, (avgTime + ageBias));

                    // Calculate how often this person should appear
                    let frequency = Math.ceil(1 + (BIAS * ((avgTime / minAverageTime) - 1)))

                    person.performance.frequency = frequency
                }
            })
        }

        // Now give each person a range depending on the frequency
        let frequencyTotal = 0

        /* Debug
        console.log("--------" + filter.perfType + "--------");
        console.log("HIGH:" + maxAverageTime);
        console.log("LOW:" + minAverageTime);
        */

        let logstrings: string[] = []
        quizPeople.forEach(person => {
            person.performance.frequencyOffsetStart = frequencyTotal 
            person.performance.frequencyOffsetEnd = frequencyTotal + person.performance.frequency
         //LARS TODO   person.performance.Rank = .SetRank(SortType, _Library._selectedPeople.IndexOf(person));
            person.performance.familiarity = calcFamiliarity(minAverageTime, maxAverageTime, person.performance.avgTime)
            frequencyTotal += person.performance.frequency

            logstrings.push(`${person.performance.avgTime + (MAX_TIME * 10)} \t${person.performance.frequency} \t${person.performance.frequencyOffsetStart} \t${person.performance.frequencyOffsetEnd} \t${person.expandedName}`)
        })

        logstrings.sort()
        logstrings.forEach(ls => console.log(ls))

        return {
            quizPeople,
            frequencyTotal
        }
    }

    /// Set relative familiarity value, with respect to all people in this category
    export function calcFamiliarity(minAverageTime: number, maxAverageTime: number, myAverageTime: number): number {
        // If haven't done any testing
        if (maxAverageTime === minAverageTime) {
            return 0.5
        }
        // Otherwise calculate relative to other people
        else {
            const totalDiff = maxAverageTime - minAverageTime;
            const myOffset = myAverageTime - minAverageTime;
            return 1 -  (myOffset / totalDiff);
        }
    }