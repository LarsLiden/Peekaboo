import axios from 'axios'

import { QuizPerson, QuizSet, LibrarySet, Tag, Filter } from '../models/models'
import { TestResult } from '../models/performance'
import { Person } from '../models/person'

export default class Client {

    //public static baseUrl = "http://peekabooserver.azurewebsites.net/api"
    public static baseUrl = "http://localhost:8080/api"

    public static async getPeople(): Promise<QuizPerson[]> {

        try {
            const response = await axios.get(`${this.baseUrl}/quiz`)
            return response.data as QuizPerson[]
        }
        catch (err) {
            console.log(JSON.stringify(err))
            return []
        }
    }

    public static async getPerson(guid: string): Promise<Person | null> {

        try {
            const response = await axios.get(`${this.baseUrl}/person/?guid=${guid}`)
            return response.data as Person
        }
        catch (err) {
            console.log(JSON.stringify(err))
            return null
        }
    }
    
    public static async getFilteredTags(filter: Filter | null = null): Promise<Tag[]> {

        try {
            const response = await axios.post(`${this.baseUrl}/tags`,
            {filter: filter})
            return response.data as Tag[]
        }
        catch (err) {
            console.log(JSON.stringify(err))
            return []
        }
    }

    public static async getQuizSet(filter: Filter | null = null): Promise<QuizSet | null> {

        try {
            const response = await axios.post(`${this.baseUrl}/quizset`,
            {filter: filter})
            return response.data as QuizSet
        }
        catch (err) {
            console.log(JSON.stringify(err))
            return null
        }
    }

    public static async getLibrarySet(filter: Filter | null = null): Promise<LibrarySet | null> {

        try {
            const response = await axios.post(`${this.baseUrl}/libraryset`,
            {filter: filter})
            return response.data as LibrarySet
        }
        catch (err) {
            console.log(JSON.stringify(err))
            return null
        }
    }

    public static async getTags(): Promise<Tag[]> {

        try {
            const response = await axios.get(`${this.baseUrl}/tags`)
            return response.data as Tag[]
        }
        catch (err) {
            console.log(JSON.stringify(err))
            return []
        }
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
