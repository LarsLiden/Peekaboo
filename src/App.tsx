import * as React from 'react';
import './App.css';
import './fabric.css'
import Client from './service/client'
import * as OF from 'office-ui-fabric-react'
import { setStatePromise } from './Util'
import { QuizSet, LibrarySet, Tag, Filter, PerfType } from './models/models'
import { Person } from './models/person'
import { TestResult } from './models/performance'
import QuizPage from './QuizPage';
import FilterPage from './FilterPage'
import LibraryPage from './LibraryPage'
import ViewPage from './ViewPage'

export enum Page {
  MENU = "MENU",
  FILTER = "FILTER",
  LIBRARY = "LIBRARY",
  QUIZ = "QUIZ",
  VIEW = "VIEW"
}

interface ComponentState {
  page: Page
  returnPage: Page
  quizSet: QuizSet | null
  librarySet: LibrarySet | null
  tags: Tag[]
  selectedPerson: Person | null
  filter: Filter
}

class App extends React.Component<{}, ComponentState> {

  state: ComponentState = {
    quizSet: null,
    librarySet: null,
    tags: [],
    page: Page.MENU,
    returnPage: Page.MENU,
    selectedPerson: null,
    filter: {required: [], blocked: [], perfType: PerfType.PHOTO}
  }

  componentDidMount() {
  
  }

  @OF.autobind 
  private async onClickFilter() {
    if (this.state.tags.length === 0) {
      let tags = await Client.getTags()
      this.setState({
        tags: tags,
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
  private async onClickLibrary() {
      let librarySet = await Client.getLibrarySet(this.state.filter)
      librarySet!.selectedIndex = 0
      this.setState({
        librarySet,
        page: Page.LIBRARY
      })
  }

  @OF.autobind 
  private async viewLibraryPerson(returnPage: Page = this.state.returnPage) {
      let guid = this.state.librarySet!.libraryPeople[this.state.librarySet!.selectedIndex].guid
      let selectedPerson = await Client.getPerson(guid)
      this.setState({
        selectedPerson,
        page: Page.VIEW,
        returnPage
      })
  }

  @OF.autobind 
  private async onClickImport() {
      await Client.import()
  }

  private async updateTags() {
    let tags = await Client.getFilteredTags(this.state.filter)
      this.setState({
        tags: tags,
      })
  }

  @OF.autobind 
  private async onQuiz() {
      let quizSet = await Client.getQuizSet(this.state.filter)
      this.setState({
        quizSet,
        page: Page.QUIZ
      })
  }

  @OF.autobind 
  private async onQuizDone(testResults: TestResult[]) {
      await Client.postTestResults(testResults)
      this.setState({
        page: Page.LIBRARY
      })
  }

  @OF.autobind
  private navigate(page: Page) {
    this.setState(
      { page }
    )
  }

  @OF.autobind
  private onSetReqireTag(tagName: string, set: boolean) {
  
    if (set) {
      if (this.state.filter.required.indexOf(tagName) < 0)
      {
        let required = [...this.state.filter.required, tagName] 
        this.setState({
          filter: {
            required,
            blocked: [...this.state.filter.blocked],
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
      if (this.state.filter.blocked.indexOf(tagName) < 0) {
        let blocked = [...this.state.filter.blocked, tagName] 
        this.setState({
          filter: {
            required: [...this.state.filter.required],
            blocked,
            perfType: PerfType.PHOTO
          }
        }, () => this.updateTags())
      }
    }
    else {
      let blocked = this.state.filter.blocked.filter(t => t != tagName)
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
    if (this.state.librarySet) {
      let selectedIndex = this.state.librarySet.selectedIndex + 1
      if (selectedIndex >= this.state.librarySet.libraryPeople.length) {
        selectedIndex = 0
      }
      await setStatePromise(this, {librarySet: {...this.state.librarySet, selectedIndex}})
      if (this.state.page === Page.VIEW ) {
        this.viewLibraryPerson()
      }
    }
  }

  @OF.autobind
  async onPrevLibraryPage(): Promise<void> {
    if (this.state.librarySet) {
      let selectedIndex = this.state.librarySet.selectedIndex - 1
      if (selectedIndex <= 0) {
        selectedIndex = this.state.librarySet.libraryPeople.length - 1
      }
      await setStatePromise(this, {librarySet: {...this.state.librarySet, selectedIndex}})
      if (this.state.page === Page.VIEW ) {
        this.viewLibraryPerson()
      }
    }
  }

  public render() {
    return (
      <div className="App">
        {this.state.page === Page.MENU &&
          <div
            className="AppPage">
            <OF.DefaultButton
                className="QuizButton"
                onClick={this.onClickLibrary}
                text="Welcome"
            /> 
            <OF.DefaultButton
              className="QuizButton"
              onClick={this.onClickImport}
              text="Import"
            />
          </div>
        }
        {this.state.page === Page.LIBRARY &&
          <LibraryPage
            onNext={this.onNextLibraryPage}
            onPrev={this.onPrevLibraryPage}
            onClickQuiz={this.onQuiz}
            onClickFilter={this.onClickFilter}
            onViewLibraryPerson={(returnPage: Page)=> this.viewLibraryPerson(returnPage)}
            librarySet={this.state.librarySet}
            filter={this.state.filter}
          />
        } 
         {this.state.page === Page.VIEW && this.state.selectedPerson &&
          <ViewPage
            librarySet={this.state.librarySet!}
            person={this.state.selectedPerson}
            filter={this.state.filter}
            returnPage={this.state.returnPage}
            onClose={(returnPage: Page) => this.navigate(returnPage)}
            onNextPerson={this.onNextLibraryPage}
            onPrevPerson={this.onPrevLibraryPage}
          />
        }
        {this.state.page === Page.FILTER &&
          <FilterPage
            onClose={this.onClickLibrary}
            onSetRequireTag={(tagName, value) => this.onSetReqireTag(tagName, value)}
            onSetBlockTag={(tagName, value) => this.onSetBlockedTag(tagName, value)}
            tags={this.state.tags}
            filter={this.state.filter}
          />
        }
        {this.state.page === Page.QUIZ && 
          <QuizPage
            quizSet={this.state.quizSet}
            onQuizDone={this.onQuizDone}
            />
        }
      </div>
    );
  }
}

export default App;
