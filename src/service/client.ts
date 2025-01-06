/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import axios from 'axios';
import { User, Tag } from '../models/models';
import { TestResult } from '../models/performance';
import { Person } from '../models/person';

export default class Client {

    //static baseUrl: string = "https://peekabooserver.azurewebsites.net/api";
    static baseUrl: string = "http://localhost:8080/api";  // LARS 2024 TODO - change this to the real server

    static async LOGIN(user: User): Promise<User | null> {
        const response = await axios.post(`${this.baseUrl}/login`,{user});
        return response.data;
    }

    static async GETUSERS(user: User): Promise<any> {
        const response = await axios.get(`${this.baseUrl}/users`, this.getConfig(user))
        return response.data
    }

    static async UPDATEUSER(user: User): Promise<void> {
        await axios.post(`${this.baseUrl}/user`, {user}, this.getConfig(user))
    }

    static async DELETEUSER(admin: User, userToDelete: User): Promise<void> {
        await axios.delete(`${this.baseUrl}/user/${userToDelete.hwmid}`, this.getConfig(admin))
    }

    static async EXPORT_TO_USER(admin: User, destination: User, peopleIds: string[]): Promise<User> {
        const response = await axios.post(`${this.baseUrl}/user/${destination.hwmid}`, {peopleIds}, this.getConfig(admin))
        return response.data
    }

    static async GETPEOPLESTARTINGWITH(user: User, letter: string, callback: (people: Person[] | null) => void): Promise<void> {
        console.log(`Getting ${letter}`)
        try {
            const response = await axios.get(`${this.baseUrl}/people/${letter}`, this.getConfig(user))
            let peopleJSON = response.data;
            let people: Person[] = peopleJSON.map((p: any) => new Person(p))
            callback(people)
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (axios.isAxiosError(error) && error.response) {
                    if (axios.isAxiosError(error) && error.response) {
                        if (axios.isAxiosError(error) && error.response) {
                            console.log(error.response.data)
                        } else {
                            console.log(error)
                        }
                    } else {
                        console.log(error)
                    }
                } else {
                    console.log(error)
                }
            } else {
                console.log(error)
            }
            callback(null)
        }
    }

    //=======================
    // Tags
    //=======================
    static async GET_TAGS(user: User): Promise<Tag[]> {
        const response = await axios.get(`${this.baseUrl}/tags`, this.getConfig(user))
        return response.data
    }

    static async PUT_TAG(user: User, tag: Tag): Promise<void> {
        await axios.put(`${this.baseUrl}/tag/${tag.tagId}`, {tag}, this.getConfig(user))
    }

    static async DELETE_TAG(user: User, tag: Tag): Promise<void> {
        await axios.delete(`${this.baseUrl}/tag/${tag.tagId}`, this.getConfig(user))
    }

    //=======================
    // People
    //=======================
    static async PUTPERSON(user: User, person: Person): Promise<void> {
        delete person.searchCache;
        await axios.put(`${this.baseUrl}/person`, {person}, this.getConfig(user))
    }

    static async DELETEPERSON(user: User, person: Person): Promise<void> {
        await axios.delete(`${this.baseUrl}/person/${person.personId}`, this.getConfig(user))
    }

    static async ARCHIVEPERSON(user: User, person: Person): Promise<void> {
        delete person.searchCache;
        await axios.post(
            `${this.baseUrl}/person/${person.personId}/archive`, null, this.getConfig(user)
        )
    }

    //=======================
    // Photos
    //=======================
    static async PUTPHOTO(user: User, person: Person, photoData: string): Promise<string> {
        let response = await axios.put(
            `${this.baseUrl}/person/${person.personId}/photo`,
            {photo: photoData},
            this.getConfig(user)
        )
        return response.data
    }

    static async DELETEPHOTO(user: User, person: Person, photoName: string) {
        await axios.delete(
            `${this.baseUrl}/person/${person.personId}/photo/${photoName}`, this.getConfig(user)
        )
    }

    static async POSTTESTRESULTS(user: User, testResults: TestResult[]): Promise<Person[]> {
        let response = await axios.post(`${this.baseUrl}/testresults`,
            {testResults: testResults}, this.getConfig(user))
        return response.data
    }

    static async IMPORT(user: User): Promise<void> {
        try {
            await axios.post(`${this.baseUrl}/import`, null, this.getConfig(user))
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data)
            } else {
                console.log(error)
            }
        }
    }

    static getConfig(user: User) {
        return {
                headers: {
                    'HAVE_WE_MET_HEADER': user.hwmid,
                }
            }
    }
}
