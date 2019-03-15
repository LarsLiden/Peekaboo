/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import axios from 'axios'
import { User, Tag } from '../models/models'
import { TestResult } from '../models/performance'
import { Person } from '../models/person'

export default class Client {

    public static baseUrl = "https://peekabooserver.azurewebsites.net/api"
    //public static baseUrl = "http://localhost:8080/api"

    public static async Login(user: User): Promise<User | null> {

        try {
            const response = await axios.post(`${this.baseUrl}/login`,
            {user})
            return response.data as User
        }
        catch (error) {
            console.log(error.response)
            return null
        }
    }

    public static async getUsers(user: User): Promise<User[]> {
        const response = await axios.get(`${this.baseUrl}/users`, this.getConfig(user))
        return response.data as User[]
    }

    public static async updateUser(user: User): Promise<void> {
        await axios.post(`${this.baseUrl}/user`, {user}, this.getConfig(user))
    }

    public static async deleteUser(admin: User, userToDelete: User): Promise<void> {
        await axios.delete(`${this.baseUrl}/user/${userToDelete.hwmid}`, this.getConfig(admin))
    }

    public static async exportToUser(admin: User, destination: User, peopleIds: string[]): Promise<User> {
        const response = await axios.post(`${this.baseUrl}/user/${destination.hwmid}`, {peopleIds}, this.getConfig(admin))
        return response.data as User
    }

    public static async getPeopleStartingWith(user: User, letter: string, callback: (people: Person[] | null) => void): Promise<void> {
        console.log(`Getting ${letter}`)
        try {
            const response = await axios.get(`${this.baseUrl}/people/${letter}`, this.getConfig(user))
            let peopleJSON = response.data as Person[]
            let people = peopleJSON.map(p => new Person(p))
            callback(people)
        }
        catch (error) {
            console.log(error.response.data)
            callback(null)
        }
    }

    //=======================
    // Tags
    //=======================
    public static async getTags(user: User): Promise<Tag[]> {
        const response = await axios.get(`${this.baseUrl}/tags`, this.getConfig(user))
        return response.data as Tag[]
    }

    public static async putTag(user: User, tag: Tag): Promise<void> {
        await axios.put(`${this.baseUrl}/tag/${tag.tagId}`, {tag}, this.getConfig(user))
    }

    public static async deleteTag(user: User, tag: Tag): Promise<void> {
        await axios.delete(`${this.baseUrl}/tag/${tag.tagId}`, this.getConfig(user))
    }

    //=======================
    // People
    //=======================
    public static async putPerson(user: User, person: Person): Promise<void> {
        delete person.searchCache
        await axios.put(`${this.baseUrl}/person`, {person}, this.getConfig(user))
    }

    public static async deletePerson(user: User, person: Person): Promise<void> {
        await axios.delete(`${this.baseUrl}/person/${person.personId}`, this.getConfig(user))
    }

    public static async archivePerson(user: User, person: Person): Promise<void> {
        delete person.searchCache
        await axios.post(
            `${this.baseUrl}/person/${person.personId}/archive`, null, this.getConfig(user)
        )
    }

    //=======================
    // Photos
    //=======================
    public static async putPhoto(user: User, person: Person, photoData: string): Promise<string> {
        let response = await axios.put(
            `${this.baseUrl}/person/${person.personId}/photo`,
            {photo: photoData},
            this.getConfig(user)
        )
        return response.data as string
    }

    public static async deletePhoto(user: User, person: Person, photoName: string) {
        await axios.delete(
            `${this.baseUrl}/person/${person.personId}/photo/${photoName}`, this.getConfig(user)
        )
    }

    public static async postTestResults(user: User, testResults: TestResult[]): Promise<Person[]> {
        let response = await axios.post(`${this.baseUrl}/testresults`,
            {testResults: testResults}, this.getConfig(user))
        return response.data as Person[]
    }

    public static async import(user: User): Promise<void> {
        try {
            await axios.post(`${this.baseUrl}/import`, null, this.getConfig(user))
        }
        catch (error) {
            console.log(error.response.data)
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
