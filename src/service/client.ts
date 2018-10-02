import axios from 'axios'

import { QuizPerson } from '../models/models'

export default class Client {

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
}
