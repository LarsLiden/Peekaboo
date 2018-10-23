import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import './fabric.css'
import { QuizPerson, QuizSet } from './models/models'
import { getRandomInt} from './Util'

export interface ReceivedProps {
  quizSet: QuizSet | null
  onQuizDone: () => Promise<void>
//TODO  onShowPerson: (quizPerson: QuizPerson) => void
}

const baseImage = "https://peekaboo.blob.core.windows.net/faces/"
//const timerInterval = 100

interface ComponentState {
  quizPerson: QuizPerson | null,
  imageIndex: number,
  showName: boolean,
  timerId: NodeJS.Timer | null,
  timerValue: number
}

class QuizPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    quizPerson: null,
    imageIndex: 0,
    showName: false,
    timerId: null,
    timerValue: 0
  }

  componentDidMount() {
    
  }

  componentWillReceiveProps(newProps: ReceivedProps) {
    if (this.props.quizSet != newProps.quizSet) {
        this.setState({ quizPerson: null} )
    }
  }

  // Pick a random person from the test set based on testing frequency
  getRandomPerson(): QuizPerson
  {
    if (!this.props.quizSet) {
      throw new Error("Missing Quizset")
    }
    if (this.props.quizSet.quizPeople.length == 1)
    {
        return this.props.quizSet.quizPeople[0]
    }

    const randFreq = getRandomInt(0, this.props.quizSet.frequencyTotal-1)

    let personIndex = this.props.quizSet.quizPeople.findIndex(qp =>
      {
        return (randFreq >= qp.performance.frequencyOffsetStart && randFreq < qp.performance.frequencyOffsetEnd)
      }
    )
    if (personIndex == -1) {
      throw new Error("Unable to find random person")
    }

    let quizPerson = this.props.quizSet.quizPeople[personIndex]

    // Pick one nearby rather than repeating last quized person
    if (quizPerson === this.state.quizPerson) {
      personIndex = (personIndex > 0) ? personIndex - 1 : personIndex + 1
      quizPerson = this.props.quizSet.quizPeople[personIndex]
    }
    console.log(`${randFreq}: ${quizPerson.performance.frequencyOffsetStart} / ${quizPerson.performance.frequencyOffsetEnd}`)
    return quizPerson
  }
  
  selectNextPerson(): void {
    this.clearTimer()

    const quizPerson = this.getRandomPerson()
    const imageIndex = getRandomInt(0, quizPerson.blobNames.length-1)

    this.setState({
      showName: false,
      quizPerson,
      imageIndex
    })
  }

  @OF.autobind
  onClickKnow() {
    this.selectNextPerson()
  }

  @OF.autobind
  onClickQuestion() {
    this.clearTimer()
    this.setState({
      showName: true
    })
  }

  @OF.autobind
  onClickDontKnow() {
    this.selectNextPerson()
    this.clearTimer()
  }

  @OF.autobind
  onClickQuit() {
    this.clearTimer()
    this.props.onQuizDone()
  }

  clearTimer() {
    if (this.state.timerId != null) {
      clearInterval(this.state.timerId)
      this.setState({
        timerId: null
      })
    }
  }

  @OF.autobind
  onImageLoaded() {
    this.clearTimer()
    this.setState({
      timerValue: 0
    })
 /*   const timerId = setInterval(()=> 
    {
      this.setState({
        timerValue: this.state.timerValue + timerInterval
      })
    }, timerInterval)

    this.setState({
      timerId
    })*/
  }

  public render() {
    if (!this.state.quizPerson) {
      this.selectNextPerson()
      return null
    }
    const imageFile = baseImage + this.state.quizPerson.blobNames[this.state.imageIndex]
    return (
      <div className="QuizPage">
        <div
          className="QuizTimer">
          {this.state.timerValue/1000.0}
        </div>
        <OF.Image
          className="QuizImageHolder"
          src={imageFile}
          width={250}
          height={250}
          //imageFit={OF.ImageFit.center}
          onLoad={this.onImageLoaded}
        />
        {this.state.showName && 
          <div
            className='QuizNameOverlay'>
            {this.state.quizPerson.fullName}
          </div>
        }
        <OF.DefaultButton
          className="QuizButton"
          onClick={this.onClickKnow}
          text="Y"
        />
        <OF.DefaultButton
          className="QuizButton"
          onClick={this.onClickQuestion}
          text="?"
        />
        <OF.DefaultButton
          className="QuizButton"
          onClick={this.onClickDontKnow}
          text="N"
        />
        <OF.DefaultButton
          className="QuizQuitButton"
          onClick={this.onClickQuit}
          text="Quit"
        />
      }


      </div>
    );
  }
}

export default QuizPage;
