import * as React from 'react';
import './App.css';
import './fabric.css'
import Client from './service/client'
import * as OF from 'office-ui-fabric-react'
import { QuizPerson, Tag } from './models/models'
import Quiz from './Quiz';
import QuizPrep from './QuizPrep'

enum Page {
  MENU = "MENU",
  QUIZ_PREP = "QUIZ_PREP",
  QUIZ = "QUIZ"
}

interface ComponentState {
  page: Page
  quizPeople: QuizPerson[]
  tags: Tag[]
}

class App extends React.Component<{}, ComponentState> {

  state: ComponentState = {
    quizPeople: [],
    tags: [],
    page: Page.MENU
  }

  componentDidMount() {
  
  }

  @OF.autobind 
  private async onClickFilter() {
    let tags = await Client.getTags()
    this.setState({
      tags: tags,
      page: Page.QUIZ_PREP
    })
  }

  @OF.autobind 
  private async onCloseQuizPrep(tag: string | null) {
    if (tag !== null) {
      let people = await Client.getPeople()
      this.setState({
        quizPeople: people,
        page: Page.QUIZ
      })
    }
  }


  public render() {
    return (
      <div className="App">
        {this.state.page === Page.MENU &&
            <OF.DefaultButton
                onClick={this.onClickFilter}
                text="Filter"
            /> 
        }
        {this.state.page === Page.QUIZ_PREP &&
          <QuizPrep
            onClose={this.onCloseQuizPrep}
            tags={this.state.tags}
          />
        }
        {this.state.page === Page.QUIZ &&
          <Quiz
            quizPeople={this.state.quizPeople}
          />
        }
      </div>
    );
  }
}

export default App;
