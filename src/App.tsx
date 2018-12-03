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
import { QuizSet, QuizPerson, FilterSet, Tag, Filter, PerfType, User, SortType, SortDirection } from './models/models'
import { Person } from './models/person'
import { TestResult } from './models/performance'
import Confirm from './modals/Confirm'
import * as Convert from './convert'
import QuizPage from './Pages/QuizPage'
import LoadPage from './Pages/LoadPage'
import NewUserPage from './Pages/NewUserPage'
import FilterPage from './Pages/FilterPage'
import SortPage from './Pages/SortPage'
import AdminPage from './Pages/AdminPage'
import LoginPage from './Pages/LoginPage'
import ViewPage from './Pages/ViewPage'
import EditPage from './Pages/EditPage'

export enum Page {
  LOGIN = "MENU",
  NEWUSER = "NEWUSER",
  LOAD = "LOAD",
  FILTER = "FILTER",
  SORT = "SORT",
  ADMIN = "ADMIN",
  QUIZ = "QUIZ",
  VIEW = "VIEW",
  VIEWQUIZ = "VIEWQUIZ",
  EDIT = "EDIT"
}

interface ComponentState {
  user: User | null
  users: User[]
  allPeople: Person[]
  allTags: Tag[]
  loadletter: string,
  loadlettercount: number
  loadpeoplecount: number
  page: Page
  quizSet: QuizSet | null
  filterSet: FilterSet
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
    users: [],
    allPeople: [],
    allTags: [],
    loadletter: "",
    loadlettercount: 0,
    loadpeoplecount: 0,
    quizSet: null,
    filterSet: {
      people: [],
      selectedIndex: -1
    },
    filteredTags: [],
    filteredPeopleCount: 0,
    page: Page.LOGIN,
    selectedPerson: null,
    newPerson: null,
    filter: {
      required: [], 
      blocked: [], 
      perfType: PerfType.PHOTO, 
      sortType: SortType.NAME, 
      sortDirection: SortDirection.UP},
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
  async onClickSort() {
    this.setState({
      page: Page.SORT
    })
  }

  @OF.autobind 
  async onClickAdmin() {
    if (this.state.user) {
      let users = await Client.getUsers(this.state.user) 
      this.setState({
        page: Page.ADMIN,
        users
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
    if (this.state.allPeople.length === 0) {
      this.setState({
        page: Page.NEWUSER
      })
      return
    }

    let guid = this.state.filterSet.people[this.state.filterSet.selectedIndex].guid
    let selectedPerson = Convert.getPerson(this.state.allPeople, guid) || null
    this.setState({
      selectedPerson,
      page: Page.VIEW
    })

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

            // Extract tags
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

            // Create initial filter set
            this.updateFilterSet()

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
  async onDeleteUser(userToDelete: User) {
    try {
      await Client.deleteUser(this.state.user!, userToDelete) 
      let users = this.state.users.filter(u => u.hwmid !== userToDelete.hwmid)
      this.setState({
        users
      })
    }
    catch {
      this.setState({error: `Failed to delete ${userToDelete.name}`})
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
  async onArchivePerson(person: Person) {
    try {
      await Client.archivePerson(this.state.user!, person)

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
      this.setState({error: `Failed to archive ${person.fullName()}`})
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
      setStatePromise(this, {
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
      try {
        let updatedPeople = await Client.postTestResults(this.state.user!, testResults)
        let allPeople: Person[] = [...this.state.allPeople]
        updatedPeople.forEach(p => 
          allPeople = replacePerson(allPeople, new Person(p))
        )
        this.setState({ allPeople })
 
        if (this.state.selectedPerson) {
          let selectedGuid = this.state.selectedPerson.guid
          let changedPerson = updatedPeople.find(p => p.guid === selectedGuid)
          if (changedPerson) {
            this.setState({selectedPerson: new Person(changedPerson)})
          }
        }
      }
      catch {
        this.setState({error: `Failed to save Test Results`})  
      }
      this.setState({
        page: Page.VIEW
      })
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
        let filterSet: FilterSet = {
          people: this.state.allPeople, 
          selectedIndex
        }
        await setStatePromise(this, {filterSet})
      }
      else {
        await setStatePromise(this, {filterSet: {...this.state.filterSet, selectedIndex}})
      }
      this.viewLibraryPerson()
    }
  }

  @OF.autobind
  async onCloseAdminPage() {
    await setStatePromise(this, {
      page: Page.VIEW
    })
  }

  @OF.autobind
  async onCloseFliterPage(filter: Filter) {
    await setStatePromise(this, {
      filter
    })
    this.updateFilterSet()

    let guid = this.state.filterSet.people[this.state.filterSet.selectedIndex].guid
    let selectedPerson = Convert.getPerson(this.state.allPeople, guid) || null
    await setStatePromise(this, {
      page: Page.VIEW,
      selectedPerson
    })
  }

  updateFilterSet() {
    let filterSet = Convert.getFilterSet(this.state.allPeople, this.state.filter)
    
    // TODO: also might trigger if overconstrained filter
    if (filterSet.people.length === 0) {
      this.setState({
        page: Page.NEWUSER
      })
    }
    else {
      this.setState({
        filterSet
      })
    }
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
            onClickSort={this.onClickSort}
            onClickAdmin={this.onClickAdmin}
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
            onArchivePerson={this.onArchivePerson}
            onDeletePhoto={this.onDeletePhoto}
            onSelectPerson={this.onSelectPerson}
          />
        }
        {this.state.page === Page.FILTER &&
          <FilterPage
            allPeople={this.state.allPeople}
            allTags={this.state.allTags}
            onClose={this.onCloseFliterPage}
            filter={this.state.filter}
          />
        }
        {this.state.page === Page.SORT &&
          <SortPage
            allPeople={this.state.allPeople}
            allTags={this.state.allTags}
            onClose={this.onCloseFliterPage}
            filter={this.state.filter}
          />
        }
        {this.state.user && this.state.user!.isAdmin && this.state.page === Page.ADMIN &&
          <AdminPage
            user={this.state.user}
            users={this.state.users}
            onDeleteUser={this.onDeleteUser}
            onClose={this.onCloseAdminPage}
          />
        }
        {this.state.page === Page.QUIZ && 
          <QuizPage
            user={this.state.user!}
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
