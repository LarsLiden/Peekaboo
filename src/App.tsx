/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import './App.css';
import './fabric.css'
import Client from './service/client'
import * as OF from 'office-ui-fabric-react'
import { setStatePromise } from './Util'
import { QuizSet, QuizPerson, FilterSet, Tag, Filter, PerfType } from './models/models'
import { Person } from './models/person'
import { TestResult } from './models/performance'
import * as Convert from './convert'
import QuizPage from './Pages/QuizPage';
import LoadPage from './Pages/LoadPage'
import FilterPage from './Pages/FilterPage'
import LoginPage from './Pages/LoginPage'
import ViewPage from './Pages/ViewPage'
import EditPage from './Pages/EditPage'

export enum Page {
  LOGIN = "MENU",
  LOAD ="LOAD",
  FILTER = "FILTER",
  QUIZ = "QUIZ",
  VIEW = "VIEW",
  VIEWQUIZ = "VIEWQUIZ",
  EDIT = "EDIT"
}

interface ComponentState {
  people: Person[],
  allTags: Tag[],
  loadletter: string,
  loadlettercount: number,
  page: Page
  quizSet: QuizSet | null
  filterSet: FilterSet | null
  filteredTags: Tag[]
  filteredPeopleCount: number
  selectedPerson: Person | null
  filter: Filter
}

class App extends React.Component<{}, ComponentState> {

  state: ComponentState = {
    people: [],
    allTags: [],
    loadletter: "",
    loadlettercount: 0,
    quizSet: null,
    filterSet: null,
    filteredTags: [],
    filteredPeopleCount: 0,
    page: Page.LOGIN,
    selectedPerson: null,
    filter: {required: [], blocked: [], perfType: PerfType.PHOTO}
  }

  componentDidMount() {
  
  }

  @OF.autobind 
  private async onClickFilter() {
    if (this.state.filteredTags.length === 0) {
      let filteredPeople = Convert.filteredPeople(this.state.people, this.state.filter)
      let tags = Convert.filteredTags(filteredPeople, this.state.filter)
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
  private async onEdit() {
    this.setState({
      page: Page.EDIT
    })
  }

  @OF.autobind 
  private async viewLibraryPerson() {
      let filterSet = this.state.filterSet
      if (!filterSet) {
        filterSet = Convert.getFilterSet(this.state.people, this.state.filter)
        filterSet!.selectedIndex = 0
      }
      let guid = filterSet!.libraryPeople[filterSet!.selectedIndex].guid
      let selectedPerson = Convert.getPerson(this.state.people, guid) || null
      this.setState({
        filterSet,
        selectedPerson,
        page: Page.VIEW
      })
  }

  @OF.autobind 
  private viewQuizDetail(quizPerson: QuizPerson) {

      let selectedPerson = Convert.getPerson(this.state.people, quizPerson.guid) || null
      this.setState({
        selectedPerson,
        page: Page.VIEWQUIZ
      })
  }

  @OF.autobind 
  private async loadPeople() {
      this.setState({page: Page.LOAD})

      var letters = "ABCDE"/*FGHIJKLMNOPQRSTUVWXYZ"*/.split("")
      for (let letter of letters) {
        Client.getPeopleStartingWith(letter, async (people) => {
          console.log(`GOT ${letter}`)
          await setStatePromise(this, {
            people: [...this.state.people, ...people],
            loadletter: letter,
            loadlettercount: this.state.loadlettercount + 1
          })

          // When all are loaded
          if (this.state.loadlettercount >= letters.length-1) { 

            // Extact tags
            let allTags = Convert.extractTags(this.state.people)
            allTags = allTags.sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
                else if (b.name.toLowerCase() < a.name.toLowerCase()) return 1
                else return 0
            })
            await setStatePromise(this, {allTags})

            // Open library
            this.viewLibraryPerson()
          }
        })
      }
  }

  /*
  @OF.autobind 
  private async onClickImport() {
      await Client.import()
  }
  */

  private async updateTags() {
    let filteredPeople = Convert.filteredPeople(this.state.people, this.state.filter)
    let tags = Convert.filteredTags(filteredPeople, this.state.filter)
      this.setState({
        filteredTags: tags,
        filteredPeopleCount: filteredPeople.length
      })
  }

  @OF.autobind 
  private async onQuiz() {
      let quizSet = Convert.quizSet(this.state.people, this.state.filter) 
      this.setState({
        quizSet,
        page: Page.QUIZ
      })
  }

  @OF.autobind 
  private async onCloseEditPage() {
      this.setState({
        page: Page.VIEW
      })
  }

  @OF.autobind 
  private async onSaveEditPage(person: Person) {
      await Client.putPerson(person)
      this.setState({
        selectedPerson: person,
        page: Page.VIEW
      })
  }

  @OF.autobind 
  private async onSaveImage(person: Person, newImage: Blob) {
      await Client.putImage(person.guid, newImage)
  }

  @OF.autobind 
  private async onContinueQuiz() {
      this.setState({
        page: Page.QUIZ
      })
  }

  @OF.autobind 
  private async onQuizDone(testResults: TestResult[]) {
      await Client.postTestResults(testResults)
      this.setState({
        page: Page.VIEW
      })
  }

  @OF.autobind
  private onSetReqireTag(tagName: string, set: boolean) {
  
    if (set) {
      if (this.state.filter.required.indexOf(tagName) <= 0)
      {
        let blocked = this.state.filter.blocked.filter(t => t != tagName)
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
      let required = this.state.filter.required.filter(t => t != tagName)
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
  private onSetBlockedTag(tagName: string, set: boolean) {
  
    if (set)
    { 
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
  async onNextLibraryPage(): Promise<void> {
    if (this.state.filterSet) {
      let selectedIndex = this.state.filterSet.selectedIndex + 1
      if (selectedIndex >= this.state.filterSet.libraryPeople.length) {
        selectedIndex = 0
      }
      await setStatePromise(this, {filterSet: {...this.state.filterSet, selectedIndex}})
      if (this.state.page === Page.VIEW ) {
        this.viewLibraryPerson()
      }
    }
  }

  @OF.autobind
  async onPrevLibraryPage(): Promise<void> {
    if (this.state.filterSet) {
      let selectedIndex = this.state.filterSet.selectedIndex - 1
      if (selectedIndex < 0) {
        selectedIndex = this.state.filterSet.libraryPeople.length - 1
      }
      await setStatePromise(this, {filterSet: {...this.state.filterSet, selectedIndex}})
      if (this.state.page === Page.VIEW ) {
        this.viewLibraryPerson()
      }
    }
  }

  @OF.autobind
  private async onCloseFliterPage() {
    await setStatePromise(this, {filterSet: null})
    this.viewLibraryPerson()
  }

  public render() {
    return (
      <div className="App">
        {this.state.page === Page.LOGIN &&
         <LoginPage
          onLoginComplete={this.loadPeople}
         />
        }
        {this.state.page === Page.LOAD &&
          <LoadPage
            letter={this.state.loadletter}
            count={this.state.people.length}
          />
        }
        {(this.state.page === Page.VIEW || this.state.page === Page.VIEWQUIZ) 
          && this.state.selectedPerson &&
          <ViewPage
            filterSet={this.state.page === Page.VIEW ? this.state.filterSet! : null}
            person={this.state.selectedPerson}
            filter={this.state.filter}
            onClickQuiz={this.onQuiz}
            onContinueQuiz={this.onContinueQuiz}
            onClickFilter={this.onClickFilter}
            onEdit={this.onEdit}
            onNextPerson={this.onNextLibraryPage}
            onPrevPerson={this.onPrevLibraryPage}
          />
        }
        {this.state.page === Page.EDIT && this.state.selectedPerson &&
          <EditPage
            person={this.state.selectedPerson}
            filter={this.state.filter}
            onClose={this.onCloseEditPage}
            onSave={this.onSaveEditPage}
            onSaveImage={this.onSaveImage}
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
      </div>
    );
  }
}

export default App;
