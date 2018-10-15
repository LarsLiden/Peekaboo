import * as React from 'react';
import './App.css';
import './fabric.css'
import Client from './service/client'
import * as OF from 'office-ui-fabric-react'
import { QuizSet, Tag, Filter, PerfType } from './models/models'
import Quiz from './Quiz';
import FilterPage from './FilterPage'

enum Page {
  MENU = "MENU",
  FILTER = "FILTER",
  QUIZ = "QUIZ"
}

interface ComponentState {
  page: Page
  quizSet: QuizSet | null
  tags: Tag[]
  filter: Filter
}

class App extends React.Component<{}, ComponentState> {

  state: ComponentState = {
    quizSet: null,
    tags: [],
    page: Page.MENU,
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
  private async onCloseQuizPrep() {
      this.setState({
        page: Page.MENU
      })
  }

  @OF.autobind 
  private async onQuizDone() {
      this.setState({
        page: Page.MENU
      })
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
                onClick={this.onClickFilter}
                text="Filter"
            /> 
            <OF.DefaultButton
              className="QuizButton"
              onClick={this.onClickImport}
              text="Import"
            />
          </div>
        }
        {this.state.page === Page.FILTER &&
          <FilterPage
            onQuiz={this.onQuiz}
            onClose={this.onCloseQuizPrep}
            onSetRequireTag={(tagName, value) => this.onSetReqireTag(tagName, value)}
            onSetBlockTag={(tagName, value) => this.onSetBlockedTag(tagName, value)}
            tags={this.state.tags}
            filter={this.state.filter}
          />
        }
        {this.state.page === Page.QUIZ && 
          <Quiz
            quizSet={this.state.quizSet}
            onQuizDone={this.onQuizDone}
          />
        }
      </div>
    );
  }
}

export default App;
