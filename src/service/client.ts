import axios from 'axios'
import { StartState } from '../models/models'
import { TestResult } from '../models/performance'
import { Person } from '../models/person'
import * as blobToBuffer from 'blob-to-buffer'

export default class Client {

    //public static baseUrl = "https://peekabooserver.azurewebsites.net/api"
    public static baseUrl = "http://localhost:8080/api"

    public static async start(name: string): Promise<StartState> {

        try {
            const response = await axios.post(`${this.baseUrl}/start`,
            {name})
            return response.data as StartState
        }
        catch (err) {
            console.log(JSON.stringify(err))
            return StartState.INVALID
        }
    }

    public static async getPeopleStartingWith(letter: string, callback: (people: Person[]) => void): Promise<void> {

        try {
            console.log(`Getting ${letter}`)
            const response = await axios.get(`${this.baseUrl}/people/${letter}`)
            let peopleJSON = response.data as Person[]
            let people = peopleJSON.map(p => new Person(p))
            callback(people)
        }
        catch (err) {
            console.log(JSON.stringify(err))
        }
    }

    public static async putPerson(person: Person): Promise<void> {
        try {
            await axios.put(`${this.baseUrl}/person`,
                {person})
            return
        }
        catch (err) {
            console.log(JSON.stringify(err))
        }
    }

    public static async putImage(personGUID: string, blob: Blob) {
        blobToBuffer(blob, async (error, buffer) => {
            if (!error) {
                await axios.put(`${this.baseUrl}/person/${personGUID}/image`,
                {image: JSON.stringify(buffer)})
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

    public static async import(): Promise<void> {
        try {
            await axios.post(`${this.baseUrl}/import`)
        }
        catch (err) {
            console.log(JSON.stringify(err))
        }
    }
}
