import * as React from 'react';
import './App.css';
import './fabric.css'
import Client from './service/client'
import * as OF from 'office-ui-fabric-react'
import { QuizSet, LibrarySet, Tag, Filter, PerfType } from './models/models'
import { Person } from './models/person'
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
      this.setState({
        librarySet,
        page: Page.LIBRARY
      })
  }

  @OF.autobind 
  private async onClickPerson(guid: string, returnPage: Page) {
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
  private async onQuizDone() {
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
            onClickQuiz={this.onQuiz}
            onClickFilter={this.onClickFilter}
            onClickPerson={(guid: string, returnPage: Page)=> this.onClickPerson(guid, returnPage)}
            librarySet={this.state.librarySet}
            filter={this.state.filter}
            initialGuid={this.state.selectedPerson ? this.state.selectedPerson.guid : null }
          />
        }: 
         {this.state.page === Page.VIEW && this.state.selectedPerson &&
          <ViewPage
            person={this.state.selectedPerson}
            filter={this.state.filter}
            returnPage={this.state.returnPage}
            onClose={(returnPage: Page) => this.navigate(returnPage)}
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
