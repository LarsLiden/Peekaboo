import axios from 'axios'

import { QuizPerson, QuizSet, Tag, Filter } from '../models/models'

export default class Client {

    public static baseUrl = "http://peekabooserver.azurewebsites.net/api"
    //public static baseUrl = "http://localhost:8080/api"

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

    public static async import(): Promise<void> {
        try {
            const response = await axios.get(`${this.baseUrl}/test`)
            console.log(response)
        }
        catch (err) {
            console.log(JSON.stringify(err))
        }
        /*
        try {
            await axios.post(`${this.baseUrl}/import`)
        }
        catch (err) {
            console.log(JSON.stringify(err))
        }
        */
    }

}
