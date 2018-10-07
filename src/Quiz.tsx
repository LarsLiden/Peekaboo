import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import './fabric.css'
import { QuizPerson } from './models/models'
import { getRandomInt} from './Util'

export interface ReceivedProps {
  quizPeople: QuizPerson[]
}

const baseImage = "https://peekaboo.blob.core.windows.net/faces/"
const timerInterval = 100

interface ComponentState {
  personIndex: number,
  imageIndex: number,
  showName: boolean,
  timerId: NodeJS.Timer | null,
  timerValue: number
}

class Quiz extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    personIndex: 0,
    imageIndex: 0,
    showName: false,
    timerId: null,
    timerValue: 0
  }

  componentDidMount() {
    
  }

  selectNextPerson(): void {
    this.clearTimer()

    const personIndex = this.state.personIndex + 1
    const person = this.props.quizPeople[personIndex]
    const imageIndex = getRandomInt(0, person.blobNames.length-1)

    this.setState({
      showName: false,
      personIndex,
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
    const timerId = setInterval(()=> 
    {
      this.setState({
        timerValue: this.state.timerValue + timerInterval
      })
    }, timerInterval)

    this.setState({
      timerId
    })
  }

  public render() {
    const person = this.props.quizPeople[this.state.personIndex]
    const imageFile = baseImage + person.blobNames[this.state.imageIndex]
    return (
      <div className="QuizPage">
        {this.state.timerValue/1000.0}
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
            {person.fullName}
          </div>
        }
        <OF.DefaultButton
            onClick={this.onClickKnow}
            text="Y"
        />
        {this.state.showName 
            ? 
            <OF.DefaultButton
              onClick={this.onClickDontKnow}
              text="N"
            />
            :
            <OF.DefaultButton
              onClick={this.onClickQuestion}
              text="?"
          />
        }


      </div>
    );
  }
}

export default Quiz;
