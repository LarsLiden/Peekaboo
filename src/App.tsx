import * as React from 'react';
import './App.css';
import Client from './service/client'
import * as OF from 'office-ui-fabric-react'
import logo from './logo.svg';


class App extends React.Component {

  componentDidMount() {
  }

  @OF.autobind
  private async onClickQuiz() {
    let people = await Client.getPeople()
    console.log(people[0])
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <OF.DefaultButton
            onClick={this.onClickQuiz}
            text="quiz"
        />

        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
