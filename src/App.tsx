/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import './App.css';
import './fabric.css'
import Client from './service/client'
import { autobind } from 'core-decorators'
import { setStatePromise, replacePerson, getRandomInt, SAD_IMAGE } from './Util'
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
import EditPage, { SubPage } from './Pages/EditPage'
import InstallPage from './Pages/InstallPage'
import TagEditorPage from './Pages/TagEditorPage'
import Search from './modals/Search'
import ViewPerformance from './modals/ViewPerformance'
import BeforeInstallPromptEvent from './models/beforeInstallPromptEvent'

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
  EDIT = "EDIT",
  EDITQUIZ = "EDITQUIZ",
  EDITTAGS = "EDITTAGS",
  PERFORMANCE = "PERFORMANCE",
  SEARCH = "SEARCH",
  INSTALL = "INSTALL"
}

interface ComponentState {
  user: User | null
  // If user included in db, this is user's Id
  userPersonId: string | null
  users: User[]
  allPeople: Person[]
  allTags: Tag[]
  loadletter: string,
  loadlettercount: number
  loadpeoplecount: number
  page: Page
  subpage: string | null
  backpage: Page | null
  pageHashChanged: boolean
  quizSet: QuizSet | null
  filterSet: FilterSet
  filteredTags: Tag[]
  filteredPeopleCount: number
  selectedPerson: Person | null
  personList: string[]
  filter: Filter
  error: string | null
  installEvent: BeforeInstallPromptEvent | null
}

class App extends React.Component<{}, ComponentState> {

  state: ComponentState = {
    user: null,
    userPersonId: null,
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
    subpage: null,
    backpage: null,
    pageHashChanged: false,
    selectedPerson: null,
    personList: [],
    filter: {
      requiredTagIds: [], 
      blockedTagIds: [], 
      searchTerm: null,
      perfType: PerfType.PHOTO, 
      sortType: SortType.NAME, 
      sortDirection: SortDirection.UP},
    error: null,
    installEvent: null
  }

  @autobind
  async onSetPage(page: Page, backpage: Page | null, subPage: SubPage | null) {
    await setStatePromise(this, {
      page,
      backpage,
      subPage: subPage || this.state.subpage,
      pageHashChanged: true
    })
    if (subPage) {
      location.hash = `${this.state.page}_${subPage}`
    }
    else {
      location.hash = `${this.state.page}`
    }
  }
  
  @autobind
  async onSetSubpage(subpage: string | null) {
    await setStatePromise(this, {
      subpage,
      pageHashChanged: true
    })
    if (subpage) {
      location.hash = `${this.state.page}_${subpage}`
    }
    else {
      location.hash = `${this.state.page}`
    }
  } 

  async componentDidMount() {
    window.onhashchange = this.onPageHashChanged

    window.addEventListener('beforeinstallprompt', (e: BeforeInstallPromptEvent) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
    
      this.setState({installEvent: e})
    })

    // Look for cached user
    const userstring = localStorage.getItem('user')
    if (userstring) {
      const user: User = JSON.parse(userstring)
      try {
        let foundUser = await Client.Login(user)
        
        if (foundUser) {
          this.onLoginComplete(foundUser)
        }
      }
      catch (error) {
        localStorage.removeItem('user')
      }
    }
  }

  @autobind
  async onPageHashChanged() {

    // If page has was manually changed, ignore it
    if (this.state.pageHashChanged) {
      this.setState({
        pageHashChanged: false
      })
    }
    // Otherwise handle back event
    else if (this.state.subpage) {
      await setStatePromise(this, {
        subpage: null,
        pageHashChanged: (location.hash !== `#${this.state.page}`)
      })
      location.hash = `${this.state.page}`
    }
    else if (this.state.backpage) {
      let backpage = this.state.backpage
      await setStatePromise(this, {
        page: this.state.backpage,
        backpage: null,
        pageHashChanged: (location.hash !== `#${backpage}`)
      })
      location.hash = backpage
    }
  }

  @autobind 
  async onClickTagFilter() {
  //  if (this.state.filteredTags.length === 0) { LARS
      let filteredPeople = Convert.filterPeople(this.state.allPeople, this.state.allTags, this.state.filter)
  //    let tags = Convert.filteredTags(filteredPeople, this.state.allPeople, this.state.filter)
      this.setState({
   //     filteredTags: tags,
        filteredPeopleCount: filteredPeople.length
      })
  //  }
    this.onSetPage(Page.FILTER, Page.VIEW, null)
  }

  @autobind 
  async onEditTags() {
    this.onSetPage(Page.EDITTAGS, Page.VIEW, null)
  }

  @autobind 
  async onClickSearchFilter(searchTerm: string) {

    await setStatePromise(this, {
      filter: {...this.state.filter, searchTerm }
    })
    this.updateFilterSet()

    let personId = this.state.filterSet.people[this.state.filterSet.selectedIndex].personId
    let selectedPerson = Convert.getPerson(this.state.allPeople, personId!) || null
    await setStatePromise(this, {
      selectedPerson
    })
    await this.onSetPage(Page.VIEW, null, null)
  }

  @autobind 
  async onClickAdmin() {
    if (this.state.user) {
      let users = await Client.getUsers(this.state.user) 
      users = users.sort((a, b) => {
        if (a.isAdmin) { return -1 }
        if (a.name < b.name) { return -1 }
        else if (b.name < a.name) { return 1 }
        else { return 0 }
      })
      this.setState({
        users
      })
      this.onSetPage(Page.ADMIN, Page.VIEW, null)
    }
  }

  @autobind
  addToPersonList() {
    if (this.state.selectedPerson && this.state.selectedPerson.personId) {
      let selectedPersonId = this.state.selectedPerson.personId
      // Remove
      if (this.state.personList.find(p => p === selectedPersonId)) {
        this.setState({
          personList: this.state.personList.filter(p => p !== selectedPersonId)
        })
      }
      // Or add
      else {
        this.setState({
          personList: [...this.state.personList, this.state.selectedPerson!.personId!]
        })
      }
    }
    else {
      console.log("WARNING: Unexpected missing selectdPerson or PersonId")
    }
  }
  @autobind 
  async onEdit() {
    if (this.state.page === Page.VIEWQUIZ) {
      this.onSetPage(Page.EDITQUIZ, Page.VIEWQUIZ, null)
    }
    else {
      this.onSetPage(Page.EDIT, Page.VIEW, null)
    }
  }

  @autobind 
  async viewLibraryPerson() {
    if (this.state.allPeople.length === 0) {
      this.handleNoUsers()
      return
    }

    let personId = this.state.filterSet.people[this.state.filterSet.selectedIndex].personId
    let selectedPerson = Convert.getPerson(this.state.allPeople, personId!) || null
    this.setState({
      selectedPerson
    })
    this.onSetPage(Page.VIEW, null, null)
  }

  @autobind 
  viewQuizDetail(quizPerson: QuizPerson) {
      let selectedPerson = Convert.getPerson(this.state.allPeople, quizPerson.personId) || null
      this.setState({
        selectedPerson
      })
      this.onSetPage(Page.VIEWQUIZ, Page.QUIZ, null)
  }

  @autobind 
  async onLoginComplete(user: User) {
    await setStatePromise(this, {
      user: user,
      selectedPerson: null
    })
    this.loadPeople()
  }

  @autobind 
  async loadPeople() {

    // Attempt to get tags from local cache
    const allTagsString = localStorage.getItem('allTags')
    if (allTagsString) {
      const allTags: Person[] = JSON.parse(allTagsString)
      await setStatePromise(this, {allPeople: allTags})
    }

    // Attempt to get people from local cache
    let loadedFromCache = false
    const allPeopleString = localStorage.getItem('allPeople')
    if (allPeopleString) {
      const rawPeople: Person[] = JSON.parse(allPeopleString)
      const allPeople = rawPeople.map(p => new Person(p))
      loadedFromCache = true
      await setStatePromise(this, {allPeople})

      // Select random person on load
      const selectedIndex = getRandomInt(0, this.state.allPeople.length - 1)
      const selectedPerson = this.state.allPeople[selectedIndex]
      this.setState({
        selectedPerson
      })

      this.onSetPage(Page.SEARCH, Page.VIEW, null)
    }
    else {
      // If I have no local cache go to load page
      this.onSetPage(Page.LOAD, null, null)
    }

    // Now load people and tags from server
    let loaded: Person[][] = []
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
      for (let letter of letters) {
        Client.getPeopleStartingWith(this.state.user!, letter, async (people) => {
          if (!people) {
            this.setState({
              error: `Failed find your peeps`,
            })
            this.onSetPage(Page.LOGIN, null, null)
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

            // Something went wrong, go back to login
            // TODO: show error message first
            if (allPeople.length === 0) {
              this.onSetPage(Page.LOGIN, null, null)
              return
            }

            // Sort people alphabetically
            allPeople = allPeople.sort((a, b) => {
              if (a.fullName().toLowerCase() < b.fullName().toLowerCase()) { return -1 }
              else if (b.fullName().toLowerCase() < a.fullName().toLowerCase()) { return 1 }
              else { return 0 }
            })

            let allTags = await Client.getTags(this.state.user!)
            await setStatePromise(this, {
              allPeople,
              allTags
            })

            localStorage.setItem('allPeople', JSON.stringify(allPeople))
            localStorage.setItem('allTage', JSON.stringify(allTags))

            // Look for logged in user in list
            let userPerson = allPeople.find(p => p.fullName() === this.state.user!.name)
            let userPersonId = userPerson ? userPerson.personId : null
            this.setState({
              userPersonId
            })

            // Create initial filter set
            this.updateFilterSet()

            await this.sendUserStats()

            let selectedPerson: Person | undefined
            if (loadedFromCache) {
              // Map old person to newly loaded one
              if (this.state.selectedPerson) {
                selectedPerson = this.state.allPeople.find(p => p.personId === this.state.selectedPerson!.personId)
              }
            }
            else {
              // Select random person on load
              const selectedIndex = getRandomInt(0, this.state.allPeople.length - 1)
              selectedPerson = this.state.allPeople[selectedIndex]

              this.setState({
                selectedPerson
              })
            }
            
            if (this.state.user!.isNew) {
              this.onSetPage(Page.NEWUSER, null, null)
            } 
            // Prompt for install PWA
            else if (this.state.installEvent) {
              this.onSetPage(Page.INSTALL, Page.VIEW, null)
            }
            // Open library 
            else if (!loadedFromCache) {
              this.viewLibraryPerson()
            }
          }
        })
      }
  }

  @autobind 
  async onDeleteTag(tag: Tag) {

    await Client.deleteTag(this.state.user!, tag)

    let allTags = this.state.allTags.filter(t => t.tagId !== tag.tagId)
    await setStatePromise(this, { allTags })
  }

  @autobind 
  async onSaveTag(tag: Tag) {

    await Client.putTag(this.state.user!, tag)

    let allTags = this.state.allTags.filter(t => t.tagId !== tag.tagId)
    allTags.push(tag)
    this.setState({ allTags })
  }

  sortTags(allTags: Tag[]) {
    return allTags.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1 }
        else if (b.name.toLowerCase() < a.name.toLowerCase()) { return 1 }
        else { return 0 }
    })
  }

  // Send stats back to server
  async sendUserStats(): Promise<void> {
    const numPhotos = this.state.allPeople.reduce((acc, person) => {return acc + person.photoFilenames.length}, 0)
    const numTestResults = this.state.allPeople.reduce((acc, person) => {return acc + person.photoPerformance.numPresentations}, 0)
    let user = {...this.state.user!,
      numPeople: this.state.allPeople.length,
      numPhotos,
      numTestResults
    }
    await Client.updateUser(user)

    this.setState({user})
  }
  @autobind 
  async onClickImport() {
      await Client.import(this.state.user!)
      this.loadPeople()
  }

  @autobind 
  async onQuiz() {
      let quizSet = Convert.quizSet(this.state.allPeople, this.state.allTags, this.state.filter, this.state.userPersonId) 
      this.setState({
        quizSet
      })
      this.onSetPage(Page.QUIZ, Page.VIEW, null)  // TODO save?
  }

  @autobind
  onCloseError() {
    this.setState({error: null})
  }

  @autobind 
  async onCloseEditPage() {
    if (this.state.page === Page.EDITQUIZ) {
      this.onSetPage(Page.VIEWQUIZ, Page.QUIZ, null)  
    }
    else {
      this.viewLibraryPerson()
    }
  }

  @autobind
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

  @autobind
  async onExportToUser(destination: User) {
    try {
      let peopleIds = this.state.personList.length > 0 
        ? this.state.personList
        : this.state.filterSet.people.map(p => p.personId!)
      await Client.exportToUser(this.state.user!, destination, peopleIds) 
    }
    catch {
      this.setState({error: `Failed to export ${destination.name}`})
    }
  }
  
  @autobind 
  async onDeletePerson(person: Person) {
    try {
      await Client.deletePerson(this.state.user!, person)

      // Delete local
      let people = this.state.allPeople.filter(p => p.personId !== person.personId)
      
      // Recalculte filter set to exclude new person
      let selectedIndex = Math.max(this.state.filterSet.selectedIndex - 1, 0)
      let filterSet = Convert.getFilterSet(people, this.state.allTags, this.state.filter, null)
      filterSet.selectedIndex = selectedIndex

      await setStatePromise(this, {
        allPeople: people,
        filterSet
      })
      this.onSetPage(Page.VIEW, null, null)
      this.viewLibraryPerson()
    }
    catch {
      this.setState({error: `Failed to delete ${person.fullName()}`})
    }
  }

  @autobind 
  async onArchivePerson(person: Person) {
    try {
      // Delete local
      let people = this.state.allPeople.filter(p => p.personId !== person.personId)
      
      // Recalculte filter set to exclude new person
      let selectedIndex = Math.max(this.state.filterSet.selectedIndex - 1, 0)
      let filterSet = Convert.getFilterSet(people, this.state.allTags, this.state.filter, null)
      filterSet.selectedIndex = selectedIndex
      await setStatePromise(this, {
        allPeople: people,
        filterSet
      })

      if (this.state.page === Page.EDITQUIZ && this.state.quizSet) {
        // Remove person from quiz set
        let quizPeople = this.state.quizSet.quizPeople.filter(q => q.personId !== person.personId)
        await setStatePromise(this, {
          quizSet: {...this.state.quizSet, quizPeople}
        })
        this.onSetPage(Page.QUIZ, Page.VIEW, null)
      }
      else {
        this.onSetPage(Page.VIEW, null, null)
        this.viewLibraryPerson()
      }

      await Client.archivePerson(this.state.user!, person)

    }
    catch {
      this.setState({error: `Failed to archive ${person.fullName()}`})
    }
  }

  @autobind 
  async onSavePerson(person: Person) {
    try {
      await Client.putPerson(this.state.user!, person)

      // Replace or add to allPeople
      let people = this.state.allPeople.filter(p => p.personId !== person.personId)
      await setStatePromise(this, {
        selectedPerson: person,
        allPeople: [...people, person]
      })

      this.updateFilterSet()
    }
    catch {
      this.setState({error: `Failed to save ${person.fullName()}`})
    }
  }

  @autobind 
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

  @autobind 
  async onSavePhoto(person: Person, photoData: string) {
    try {
      let newPhotoName = await Client.putPhoto(this.state.user!, person, photoData)

      // Upldate local copy
      person.photoFilenames.push(newPhotoName)
      let allPeople = replacePerson(this.state.allPeople, person)
      await setStatePromise(this, {
        allPeople
      })
    }
    catch {
      this.setState({error: `Failed to save photo`})
    }
  }

  @autobind 
  async onQuizDone(testResults: TestResult[]) {
    this.onSetPage(Page.VIEW, null, null)
    try {
      // Remove any archived people
      let validTestResults = testResults.filter(tr => this.state.allPeople.find(p => p.personId === tr.personId))
      
      // Send results to server
      let updatedPeople = await Client.postTestResults(this.state.user!, validTestResults)
      let allPeople: Person[] = [...this.state.allPeople]
      updatedPeople.forEach(p => 
        allPeople = replacePerson(allPeople, new Person(p))
      )
      this.setState({ allPeople })

      if (this.state.selectedPerson) {
        let selectedpersonId = this.state.selectedPerson.personId
        let changedPerson = updatedPeople.find(p => p.personId === selectedpersonId)
        if (changedPerson) {
          this.setState({selectedPerson: new Person(changedPerson)})
        }
      }
    }
    catch {
      this.setState({error: `Failed to save Test Results`})  
    }
  }

  @autobind
  async onNewPerson(): Promise<void> {
    let person = new Person()
    let today = new Date()
    person.creationDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`
    this.setState({
      selectedPerson: person
    })
    this.onSetPage(Page.EDIT, Page.VIEW, null)
  }

  @autobind
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

  @autobind
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

  @autobind
  async onSelectPerson(personId: string): Promise<void> {
    if (this.state.filterSet) {
      let selectedIndex = this.state.filterSet.people.findIndex(p => p.personId === personId)
      
      // If person not in filter, clear the filter and try again
      if (selectedIndex < 0) {
        await this.clearFilter()
        this.onSelectPerson(personId)
        return
      }

      await setStatePromise(this, {filterSet: {...this.state.filterSet, selectedIndex}})
      this.viewLibraryPerson()
    }
  }

  @autobind
  async onCloseFliterPage(filter: Filter) {
    await setStatePromise(this, {
      filter
    })
    this.updateFilterSet()

    let personId = this.state.filterSet.people[this.state.filterSet.selectedIndex].personId
    let selectedPerson = Convert.getPerson(this.state.allPeople, personId!) || null
    await setStatePromise(this, {
      selectedPerson
    })
    await this.onSetPage(Page.SEARCH, null, null)
  }

  @autobind
  async onCloseEditTagsPage() {
    await this.onSetPage(Page.VIEW, null, null)
  }

  @autobind
  showInstallPrompt() {
    if (!this.state.installEvent) {
      return
    }

    this.state.installEvent.prompt();
  
    // Wait for the user to respond to the prompt
    this.state.installEvent.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.setState({
          installEvent: null
        })
        this.onSetPage(Page.VIEW, null, null)
      });
  }
  
  handleNoUsers() {
    if (this.state.user!.isAdmin) {
      this.onSetPage(Page.ADMIN, Page.VIEW, null)
    }
    else {
      this.onSetPage(Page.NEWUSER, null, null)
    }
  }

  async clearFilter() {
    await setStatePromise(this, {
      filter: {...this.state.filter,
        required: [],
        blocked: [],
        perfType: PerfType.PHOTO
      }
    })
    this.updateFilterSet()
  }

  updateFilterSet() {
    // TODO: if selected person not inclued, clear filter
    let filterSet = Convert.getFilterSet(this.state.allPeople, this.state.allTags, this.state.filter, this.state.selectedPerson)
    
    // TODO: also might trigger if overconstrained filter
    if (filterSet.people.length === 0) {
      this.handleNoUsers()
    }
    else {
      this.setState({
        filterSet
      })
    }
  }

  public render() {
    let baseClass = 'App'
    if (this.state.user && this.state.user.isSpoof) {
      baseClass = `${baseClass} Spoof`
    }
    return ( 
      <div className={baseClass}>

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
        {this.state.page === Page.INSTALL &&
          <InstallPage
            onCancel={() => this.onSetPage(Page.VIEW, null, null)}
            onConfirm={this.showInstallPrompt}
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
            allTags={this.state.allTags}
            personList={this.state.personList}
            onSetPage={this.onSetPage}
            onClickQuiz={this.onQuiz}
            onContinueQuiz={() => this.onSetPage(Page.QUIZ, Page.VIEW, null)}
            onClickTagFilter={this.onClickTagFilter}
            onClickSort={() => this.onSetPage(Page.SORT, Page.VIEW, null)}
            onClickAdmin={this.onClickAdmin}
            onEdit={this.onEdit}
            onAddToPersonList={this.addToPersonList}
            onNewPerson={this.onNewPerson}
            onNextPerson={this.onNextPerson}
            onPrevPerson={this.onPrevPerson}
            onSelectPerson={this.onSelectPerson}
          />
        }
        {this.state.page === Page.NEWUSER && 
          <NewUserPage
            onClose={this.viewLibraryPerson}
          />
        }
        {(this.state.page === Page.EDIT || this.state.page === Page.EDITQUIZ) && this.state.selectedPerson &&
          <EditPage
            person={this.state.selectedPerson}
            user={this.state.user!}
            filter={this.state.filter}
            allTags={this.state.allTags}
            allPeople={this.state.allPeople}
            subpage={this.state.subpage}
            onSetSubpage={this.onSetSubpage}
            onClose={this.onCloseEditPage}
            onSavePerson={this.onSavePerson}
            onSavePhoto={this.onSavePhoto}
            onDeletePerson={this.onDeletePerson}
            onArchivePerson={this.onArchivePerson}
            onDeletePhoto={this.onDeletePhoto}
            onSelectPerson={this.onSelectPerson}
            onSaveTag={this.onSaveTag}
            onEditTags={this.onEditTags}
            onDeleteTag={this.onDeleteTag}
          />
        }
        {this.state.page === Page.FILTER &&
          <FilterPage
            allPeople={this.state.allPeople}
            allTags={this.state.allTags}
            onClose={this.onCloseFliterPage}
            onDeleteTag={this.onDeleteTag}
            onEditTags={this.onEditTags}
            filter={this.state.filter}
          />
        }
        {this.state.page === Page.EDITTAGS &&
          <TagEditorPage
            allTags={this.state.allTags}
            allPeople={this.state.allPeople}
            onClose={this.onCloseEditTagsPage}
            onSaveTag={this.onSaveTag}
            onDeleteTag={this.onDeleteTag}
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
            filterSet={this.state.filterSet}
            personList={this.state.personList}
            onDeleteUser={this.onDeleteUser}
            onExportToUser={this.onExportToUser}
            onImport={this.onClickImport}
            onClose={() => this.onSetPage(Page.VIEW, null, null)}
            onLogin={this.onLoginComplete}
          />
        }
        {(this.state.page === Page.QUIZ || this.state.page === Page.VIEWQUIZ || this.state.page === Page.EDITQUIZ) && 
          <QuizPage
            hidden={this.state.page !== Page.QUIZ}
            user={this.state.user!}
            allPeople={this.state.allPeople}
            quizSet={this.state.quizSet}
            onQuizDone={this.onQuizDone}
            onViewDetail={this.viewQuizDetail}
          />
        }
        {this.state.page === Page.SEARCH &&
          <Search
            allPeople={this.state.allPeople}
            allTags={this.state.allTags}
            onCancel={() => this.onSetPage(Page.VIEW, null, null)}
            onSelect={(person: Person) => this.onSelectPerson(person.personId!)}
            onClickTagFilter={this.onClickTagFilter}
            onClickSearchFilter={this.onClickSearchFilter}
            onClickQuiz={this.onQuiz}
            onNewPerson={this.onNewPerson}
          />
        }
        {this.state.page === Page.PERFORMANCE && this.state.selectedPerson && 
          <ViewPerformance
            performance={this.state.selectedPerson.photoPerformance}
            onClose={() => this.onSetPage(Page.VIEW, null, null)}
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
