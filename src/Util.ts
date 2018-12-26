/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import { Person } from './models/person'
import { User } from './models/models'

export const HEAD_IMAGE = "https://peekaboo.blob.core.windows.net/resources/HaveWeHead.png"
export const SAD_IMAGE = "https://peekaboo.blob.core.windows.net/resources/SAD_FACE.png"
export const QUIZ_BUTTON_IMAGE = "https://peekaboo.blob.core.windows.net/resources/quizicon.png"
export const PHOTO_HEIGHT = 250
export const PHOTO_WIDTH = 230 

export const MAX_TAG_LENGTH = 20
export const MAX_KEY_LENGTH = 20
export const MAX_VALUE_LENGTH = 200

export function isValid(text: string, min: number, max: number) {
    return (text && text.length <= max && text.length >= min)
}
export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function setStatePromise(that: any, newState: any) {
    return new Promise((resolve) => {
        that.setState(newState, () => {
            resolve();
        });
    });
}

export function replacePerson(people: Person[], person: Person): Person[] {
    let newPeople = people.filter(p => p.personId !== person.personId)
    newPeople.push(person)
    return newPeople
}

export function getPhotoBlobName(person: Person, photoName: string) {
    return `${person.getKey}/${person.personId}/${photoName}`
}

export function baseBlob(user: User) {
    return `https://peekaboo.blob.core.windows.net/${user.photoBlobPrefix}/`
}

export function printDate(date: Date): string {
    const options = { day: '2-digit', year: '2-digit', month: '2-digit' };
    return date.toLocaleDateString('en-US', options)
}

export function generatePersonId(firstName: string, lastName: string): string {

    let d = new Date().getTime()
    let id = 'xxxxx'.replace(/[xy]/g, char => {
      let r = ((d + Math.random() * 16) % 16) | 0
      d = Math.floor(d / 16)
      return (char === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })

    let baseName = `${firstName}_${lastName}`.replace(/[\W_]+/g, "").replace(" ", "")
    return `${baseName}_${id}`
}

export function generateGUID(): string {
    let d = new Date().getTime()
    let guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
      let r = ((d + Math.random() * 16) % 16) | 0
      d = Math.floor(d / 16)
      return (char === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
    return guid
}

/*
 // update creation date from string to milliseconds
    for (let person of allPeople) {
        let rawDate = person.creationDate
        if (!rawDate) {
        let date = new Date()
        person.creationDate = date.getTime()

        let creationDate = new Date(person.creationDate).toLocaleDateString()
        console.log(`${person.fullName()} : ${rawDate} => ${creationDate}`)
        await Client.putPerson(this.state.user!, person)
        }
        else if (typeof rawDate === "string" && rawDate.indexOf("/") > 0) {
        let dateStrings = rawDate.split("/")
        let month = Number(dateStrings[0]) - 1;
        let day = Number(dateStrings[1]) 
        let year = Number(dateStrings[2])
        let date = new Date(year, month, day)
        person.creationDate = date.getTime()

        let creationDate = new Date(person.creationDate).toLocaleDateString()
        console.log(`${person.fullName()} : ${rawDate} => ${creationDate}`)
        await Client.putPerson(this.state.user!, person)
        }
    }
*/