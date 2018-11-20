/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import axios from 'axios'
import { User } from '../models/models'
import { TestResult } from '../models/performance'
import { Person } from '../models/person'
import * as blobToBuffer from 'blob-to-buffer'

export default class Client {

    //public static baseUrl = "https://peekabooserver.azurewebsites.net/api"
    public static baseUrl = "http://localhost:8080/api"

    public static async Login(user: User): Promise<User | null> {

        try {
            const response = await axios.post(`${this.baseUrl}/login`,
            {user})
            return response.data as User
        }
        catch (err) {
            console.log(JSON.stringify(err))
            return null
        }
    }
     
    public static async getPeopleStartingWith(user: User, letter: string, callback: (people: Person[]) => void): Promise<void> {

        try {
            console.log(`Getting ${letter}`)
            const response = await axios.get(`${this.baseUrl}/people/${letter}`, this.getConfig(user))
            let peopleJSON = response.data as Person[]
            let people = peopleJSON.map(p => new Person(p))
            callback(people)
        }
        catch (err) {
            console.log(JSON.stringify(err))
        }
    }

    public static async putPerson(user: User, person: Person): Promise<void> {
        await axios.put(`${this.baseUrl}/person`, {person}/*, this.getConfig(user)*/)
    }

    public static async putImage(personGUID: string, blob: Blob) {
        blobToBuffer(blob, async (error, buffer) => {
            if (!error) {
                await axios.put(`${this.baseUrl}/person/${personGUID}/image`,
                {image: JSON.stringify(buffer)})
            }
            else {
                throw error
            }
        })
    }

    public static async postTestResults(testResults: TestResult[]): Promise<void> {

        try {
            await axios.post(`${this.baseUrl}/testresults`,
                {testResults: testResults})
            return
        }
        catch (err) {
            console.log(JSON.stringify(err))
        }
    }

    public static async import(user: User): Promise<void> {
        try {
            await axios.post(`${this.baseUrl}/import`, null, this.getConfig(user))
        }
        catch (err) {
            console.log(JSON.stringify(err))
        }
    }

    private static getConfig(user: User) {
        return {
                headers: {
                    'HAVE_WE_MET_HEADER': user.hwmid,
                }
            }
    }
}
