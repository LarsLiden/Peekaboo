/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import './App.css';
import './fabric.css'
import Client from './service/client'
import * as OF from 'office-ui-fabric-react'
import { setStatePromise, replacePerson, SAD_IMAGE } from './Util'
import { QuizSet, QuizPerson, FilterSet, Tag, Filter, PerfType, User } from './models/models'
import { Person } from './models/person'
import { TestResult } from './models/performance'
import Confirm from './modals/Confirm'
import * as Convert from './convert'
import QuizPage from './Pages/QuizPage'
import LoadPage from './Pages/LoadPage'
import NewUserPage from './Pages/NewUserPage'
import FilterPage from './Pages/FilterPage'
import LoginPage from './Pages/LoginPage'
import ViewPage from './Pages/ViewPage'
import EditPage from './Pages/EditPage'

export enum Page {
  LOGIN = "MENU",
  NEWUSER = "NEWUSER",
  LOAD = "LOAD",
  FILTER = "FILTER",
  QUIZ = "QUIZ",
  VIEW = "VIEW",
  VIEWQUIZ = "VIEWQUIZ",
  EDIT = "EDIT"
}

interface ComponentState {
  user: User | null
  allPeople: Person[]
  allTags: Tag[]
  loadletter: string,
  loadlettercount: number
  loadpeoplecount: number
  page: Page
  quizSet: QuizSet | null
  filterSet: FilterSet | null
  filteredTags: Tag[]
  filteredPeopleCount: number
  selectedPerson: Person | null
  newPerson: Person | null
  filter: Filter
  error: string | null
}

class App extends React.Component<{}, ComponentState> {

  state: ComponentState = {
    user: null,
    allPeople: [],
    allTags: [],
    loadletter: "",
    loadlettercount: 0,
    loadpeoplecount: 0,
    quizSet: null,
    filterSet: null,
    filteredTags: [],
    filteredPeopleCount: 0,
    page: Page.LOGIN,
    selectedPerson: null,
    newPerson: null,
    filter: {required: [], blocked: [], perfType: PerfType.PHOTO},
    error: null
  }

  @OF.autobind 
  async onClickFilter() {
    if (this.state.filteredTags.length === 0) {
      let filteredPeople = Convert.filteredPeople(this.state.allPeople, this.state.filter)
      let tags = Convert.filteredTags(filteredPeople, this.state.allPeople, this.state.filter)
      this.setState({
        filteredTags: tags,
        filteredPeopleCount: filteredPeople.length,
        page: Page.FILTER
      })
    }
    else {
        this.setState({
        page: Page.FILTER
      })
    }
  }

  @OF.autobind 
  async onEdit() {
    this.setState({
      page: Page.EDIT
    })
  }

  @OF.autobind 
  async viewLibraryPerson() {
    let filterSet = this.state.filterSet
    if (!filterSet) {
      filterSet = Convert.getFilterSet(this.state.allPeople, this.state.filter)
    }
    // TODO: also might trigger if overconstrained filter
    if (filterSet.people.length === 0) {
      this.setState({
        page: Page.NEWUSER
      })
    }
    else {
      let guid = filterSet.people[filterSet.selectedIndex].guid
      let selectedPerson = Convert.getPerson(this.state.allPeople, guid) || null
      this.setState({
        filterSet,
        selectedPerson,
        page: Page.VIEW
      })
    }
  }

  @OF.autobind 
  viewQuizDetail(quizPerson: QuizPerson) {
      let selectedPerson = Convert.getPerson(this.state.allPeople, quizPerson.guid) || null
      this.setState({
        selectedPerson,
        page: Page.VIEWQUIZ
      })
  }

  @OF.autobind async onLoginComplete(user: User) {
    await setStatePromise(this, {user: user})
    this.loadPeople()
  }

  @OF.autobind 
  async loadPeople() {
      let loaded: Person[][] = []
      this.setState({page: Page.LOAD})

      const letters = "ABC"/*EFGHIJKLM"/*NOPQRSTUVWXYZ"*/.split("")
      for (let letter of letters) {
        Client.getPeopleStartingWith(this.state.user!, letter, async (people) => {
          if (!people) {
            this.setState({
              error: `Failed find your peeps`,
              page: Page.LOGIN
            })
            return
          }
          console.log(`GOT ${letter}`)
          loaded.push(people)
          this.setState({
            loadletter: letter,
            loadlettercount: loaded.length,
            loadpeoplecount: loaded.reduce((acc, p) => acc + p.length, 0)
          })

          // When all are loaded
          if (loaded.length >= letters.length) { 

            let allPeople: Person[] = []
            loaded.forEach(p => allPeople = [...allPeople, ...p])

            // Sort people alphabetically
            allPeople = allPeople.sort((a, b) => {
              if (a.fullName().toLowerCase() < b.fullName().toLowerCase()) { return -1 }
              else if (b.fullName().toLowerCase() < a.fullName().toLowerCase()) { return 1 }
              else { return 0 }
            })

            // Extact tags
            let allTags = Convert.extractTags(allPeople)
            allTags = allTags.sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1 }
                else if (b.name.toLowerCase() < a.name.toLowerCase()) { return 1 }
                else { return 0 }
            })
            await setStatePromise(this, {
              allPeople,
              allTags
            })

            // Open library
            this.viewLibraryPerson()
          }
        })
      }
  }

  @OF.autobind 
  async onClickImport() {
      await Client.import(this.state.user!)
      this.loadPeople()
  }

  async updateTags() {
    let filteredPeople = Convert.filteredPeople(this.state.allPeople, this.state.filter)
    let tags = Convert.filteredTags(filteredPeople, this.state.allPeople, this.state.filter)
      this.setState({
        filteredTags: tags,
        filteredPeopleCount: filteredPeople.length
      })
  }

  @OF.autobind 
  async onQuiz() {
      let quizSet = Convert.quizSet(this.state.allPeople, this.state.filter) 
      this.setState({
        quizSet,
        page: Page.QUIZ
      })
  }

  @OF.autobind
  onCloseError() {
    this.setState({error: null})
  }

  @OF.autobind 
  async onCloseEditPage(person?: Person) {
    if (person) {
      try {
        let people: Person[]
        let filterSet = this.state.filterSet
        await Client.putPerson(this.state.user!, person)

        if (this.state.newPerson) {
          // Add new person
          people = [...this.state.allPeople, person]
          // Recalculte filter set to include new person
          filterSet = Convert.getFilterSet(people, this.state.filter, person)
        }
        else {
          // Replace local
          people = this.state.allPeople.filter(p => p.guid !== person.guid)
        }
        this.setState({
          allPeople: people,
          selectedPerson: person,
          newPerson: null,
          filterSet,
          page: Page.VIEW
        })
      }
      catch {
        this.setState({error: `Failed to save ${person.fullName()}`})
      }
    }
    else {
      this.setState({
        newPerson: null,
        page: Page.VIEW
      })
    }
  }

  @OF.autobind 
  async onDeletePerson(person: Person) {
    try {
      await Client.deletePerson(this.state.user!, person)

      // Delete local
      let people = this.state.allPeople.filter(p => p.guid !== person.guid)
      // Recalculte filter set to exclude new person
      let filterSet = Convert.getFilterSet(people, this.state.filter)
      setStatePromise(this, {
        allPeople: people,
        filterSet,
        page: Page.VIEW
      })
      this.viewLibraryPerson()
    }
    catch {
      this.setState({error: `Failed to delete ${person.fullName()}`})
    }
  }

  @OF.autobind 
  async onSavePerson(person: Person) {
    try {
      await Client.putPerson(this.state.user!, person)

      // Replace local
      let people = this.state.allPeople.filter(p => p.guid !== person.guid)
      setStatePromise(this, {
        allPeople: [...people, person]
      })

      if (this.state.selectedPerson && person.guid === this.state.selectedPerson.guid) {
        this.setState({selectedPerson: person})
      }
    }
    catch {
      this.setState({error: `Failed to save ${person.fullName()}`})
    }
  }

  @OF.autobind 
  async onDeletePhoto(person: Person, photoName: string) {
    try {
      await Client.deletePhoto(this.state.user!, person, photoName)

      // Upldate local copy
      person.photoFilenames = person.photoFilenames.filter(p => p !== photoName)
      let allPeople = replacePerson(this.state.allPeople, person)
      this.setState({
        allPeople
      })
    }
    catch {
      this.setState({error: `Failed to delete photo from ${person.fullName()}`})
    }
  }

  @OF.autobind 
  async onSavePhoto(person: Person, photoData: string) {
    try {
      let newPhotoName = await Client.putPhoto(this.state.user!, person, photoData)

      // Upldate local copy
      person.photoFilenames.push(newPhotoName)
      let allPeople = replacePerson(this.state.allPeople, person)
      this.setState({
        allPeople
      })
    }
    catch {
      this.setState({error: `Failed to save photo`})
    }
  }

  @OF.autobind 
  async onContinueQuiz() {
      this.setState({
        page: Page.QUIZ
      })
  }

  @OF.autobind 
  async onQuizDone(testResults: TestResult[]) {
      await Client.postTestResults(testResults)
      this.setState({
        page: Page.VIEW
      })
  }

  @OF.autobind
  onSetReqireTag(tagName: string, set: boolean) {
  
    if (set) {
      if (this.state.filter.required.indexOf(tagName) <= 0) {
        let blocked = this.state.filter.blocked.filter(t => t !== tagName)
        let required = [...this.state.filter.required, tagName] 
        this.setState({
          filter: {
            required,
            blocked,
            perfType: PerfType.PHOTO
          }
        }, () => this.updateTags())
      }
    }
    else {
      let required = this.state.filter.required.filter(t => t !== tagName)
      this.setState({
        filter: {
          required,
          blocked: [...this.state.filter.blocked],
          perfType: PerfType.PHOTO
        }
      }, () => this.updateTags())
    }
  }

  @OF.autobind
  onSetBlockedTag(tagName: string, set: boolean) {
  
    if (set) { 
      if (this.state.filter.blocked.indexOf(tagName) <= 0) {
        let blocked = [...this.state.filter.blocked, tagName] 
        let required = this.state.filter.required.filter(t => t !== tagName)
        this.setState({
          filter: {
            required,
            blocked,
            perfType: PerfType.PHOTO
          }
        }, () => this.updateTags())
      }
    }
    else {
      let blocked = this.state.filter.blocked.filter(t => t !== tagName)
      this.setState({
        filter: {
          required: [...this.state.filter.required],
          blocked,
          perfType: PerfType.PHOTO
        }
      }, () => this.updateTags())
    }
  }

  @OF.autobind
  async onNewPerson(): Promise<void> {
    let newPerson = new Person()
    this.setState({
      newPerson,
      page: Page.EDIT
    })
  }

  @OF.autobind
  async onNextPerson(): Promise<void> {
    if (this.state.filterSet) {
      let selectedIndex = this.state.filterSet.selectedIndex + 1
      if (selectedIndex >= this.state.filterSet.people.length) {
        selectedIndex = 0
      }
      await setStatePromise(this, {filterSet: {...this.state.filterSet, selectedIndex}})
      if (this.state.page === Page.VIEW) {
        this.viewLibraryPerson()
      }
    }
  }

  @OF.autobind
  async onPrevPerson(): Promise<void> {
    if (this.state.filterSet) {
      let selectedIndex = this.state.filterSet.selectedIndex - 1
      if (selectedIndex < 0) {
        selectedIndex = this.state.filterSet.people.length - 1
      }
      await setStatePromise(this, {filterSet: {...this.state.filterSet, selectedIndex}})
      if (this.state.page === Page.VIEW) {
        this.viewLibraryPerson()
      }
    }
  }

  @OF.autobind
  async onSelectPerson(guid: string): Promise<void> {
    if (this.state.filterSet) {
      let selectedIndex = this.state.filterSet.people.findIndex(p => p.guid === guid)
      if (selectedIndex < 0) {
        selectedIndex = this.state.allPeople.findIndex(p => p.guid === guid)
        // Clear filter set
        let filterSet: FilterSet = {people: this.state.allPeople, selectedIndex}
        await setStatePromise(this, {filterSet})
      }
      else {
        await setStatePromise(this, {filterSet: {...this.state.filterSet, selectedIndex}})
      }
      this.viewLibraryPerson()
    }
  }

  @OF.autobind
  async onCloseFliterPage() {
    await setStatePromise(this, {filterSet: null})
    this.viewLibraryPerson()
  }

  public render() {
    return (
      <div className="App">
        {this.state.page === Page.LOGIN &&
         <LoginPage
          onLoginComplete={this.onLoginComplete}
         />
        }
        {this.state.page === Page.LOAD &&
          <LoadPage
            letter={this.state.loadletter}
            count={this.state.loadpeoplecount}
          />
        }
        {(this.state.page === Page.VIEW || this.state.page === Page.VIEWQUIZ) 
          && this.state.selectedPerson &&
          <ViewPage
            filterSet={this.state.page === Page.VIEW ? this.state.filterSet! : null}
            person={this.state.selectedPerson}
            user={this.state.user!}
            filter={this.state.filter}
            allPeople={this.state.allPeople}
            onClickQuiz={this.onQuiz}
            onContinueQuiz={this.onContinueQuiz}
            onClickFilter={this.onClickFilter}
            onEdit={this.onEdit}
            onNewPerson={this.onNewPerson}
            onNextPerson={this.onNextPerson}
            onPrevPerson={this.onPrevPerson}
            onSelectPerson={this.onSelectPerson}
          />
        }
        {this.state.page === Page.NEWUSER && 
          <NewUserPage
            onClose={this.onClickImport}
          />
        }
        {this.state.page === Page.EDIT 
          && (this.state.selectedPerson || this.state.newPerson)   
          &&
          <EditPage
            person={this.state.newPerson || this.state.selectedPerson!}
            user={this.state.user!}
            filter={this.state.filter}
            allTags={this.state.allTags}
            allPeople={this.state.allPeople}
            onClose={this.onCloseEditPage}
            onSavePerson={this.onSavePerson}
            onSavePhoto={this.onSavePhoto}
            onDeletePerson={this.onDeletePerson}
            onDeletePhoto={this.onDeletePhoto}
            onSelectPerson={this.onSelectPerson}
          />
        }
        {this.state.page === Page.FILTER &&
          <FilterPage
            onClose={this.onCloseFliterPage}
            onSetRequireTag={(tagName, value) => this.onSetReqireTag(tagName, value)}
            onSetBlockTag={(tagName, value) => this.onSetBlockedTag(tagName, value)}
            tags={this.state.filteredTags}
            filter={this.state.filter}
            peopleCount={this.state.filteredPeopleCount}
          />
        }
        {this.state.page === Page.QUIZ && 
          <QuizPage
            quizSet={this.state.quizSet}
            onQuizDone={this.onQuizDone}
            onViewDetail={this.viewQuizDetail}
          />
        }
        {this.state.error && 
          <Confirm
            title={this.state.error}
            image={SAD_IMAGE}
            onCancel={this.onCloseError}
          />
        }
      </div>
    );
  }
}

export default App;
