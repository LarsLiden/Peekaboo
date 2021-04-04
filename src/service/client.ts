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

    public static async LOGIN(user: User): Promise<User | null> {
        const response = await axios.post(`${this.baseUrl}/login`,
        {user})
        return response.data as User
    }

    public static async GETUSERS(user: User): Promise<User[]> {
        const response = await axios.get(`${this.baseUrl}/users`, this.getConfig(user))
        return response.data as User[]
    }

    public static async UPDATEUSER(user: User): Promise<void> {
        await axios.post(`${this.baseUrl}/user`, {user}, this.getConfig(user))
    }

    public static async DELETEUSER(admin: User, userToDelete: User): Promise<void> {
        await axios.delete(`${this.baseUrl}/user/${userToDelete.hwmid}`, this.getConfig(admin))
    }

    public static async EXPORT_TO_USER(admin: User, destination: User, peopleIds: string[]): Promise<User> {
        const response = await axios.post(`${this.baseUrl}/user/${destination.hwmid}`, {peopleIds}, this.getConfig(admin))
        return response.data as User
    }

    public static async GETPEOPLESTARTINGWITH(user: User, letter: string, callback: (people: Person[] | null) => void): Promise<void> {
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
    public static async GET_TAGS(user: User): Promise<Tag[]> {
        const response = await axios.get(`${this.baseUrl}/tags`, this.getConfig(user))
        return response.data as Tag[]
    }

    public static async PUT_TAG(user: User, tag: Tag): Promise<void> {
        await axios.put(`${this.baseUrl}/tag/${tag.tagId}`, {tag}, this.getConfig(user))
    }

    public static async DELETE_TAG(user: User, tag: Tag): Promise<void> {
        await axios.delete(`${this.baseUrl}/tag/${tag.tagId}`, this.getConfig(user))
    }

    //=======================
    // People
    //=======================
    public static async PUTPERSON(user: User, person: Person): Promise<void> {
        delete person.searchCache
        await axios.put(`${this.baseUrl}/person`, {person}, this.getConfig(user))
    }

    public static async DELETEPERSON(user: User, person: Person): Promise<void> {
        await axios.delete(`${this.baseUrl}/person/${person.personId}`, this.getConfig(user))
    }

    public static async ARCHIVEPERSON(user: User, person: Person): Promise<void> {
        delete person.searchCache
        await axios.post(
            `${this.baseUrl}/person/${person.personId}/archive`, null, this.getConfig(user)
        )
    }

    //=======================
    // Photos
    //=======================
    public static async PUTPHOTO(user: User, person: Person, photoData: string): Promise<string> {
        let response = await axios.put(
            `${this.baseUrl}/person/${person.personId}/photo`,
            {photo: photoData},
            this.getConfig(user)
        )
        return response.data as string
    }

    public static async DELETEPHOTO(user: User, person: Person, photoName: string) {
        await axios.delete(
            `${this.baseUrl}/person/${person.personId}/photo/${photoName}`, this.getConfig(user)
        )
    }

    public static async POSTTESTRESULTS(user: User, testResults: TestResult[]): Promise<Person[]> {
        let response = await axios.post(`${this.baseUrl}/testresults`,
            {testResults: testResults}, this.getConfig(user))
        return response.data as Person[]
    }

    public static async IMPORT(user: User): Promise<void> {
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
