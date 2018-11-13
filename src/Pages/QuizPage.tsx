/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import '../fabric.css'
import { QuizPerson, QuizSet } from '../models/models'
import { getRandomInt} from '../Util'
import { TestResult } from '../models/performance'
import { MAX_TIME } from '../models/const'

export interface ReceivedProps {
  quizSet: QuizSet | null
  onQuizDone: (testResults: TestResult[]) => Promise<void>
  onViewDetail: (quizperson: QuizPerson) => void
}

const baseImage = "https://peekaboo.blob.core.windows.net/faces/"
const timerInterval = 100

interface ComponentState {
  quizPerson: QuizPerson | null,
  imageIndex: number,
  showName: boolean,
  timerId: NodeJS.Timer | null,
  timerValue: number,
  testResults: TestResult[]
}

class QuizPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    quizPerson: null,
    imageIndex: 0,
    showName: false,
    timerId: null,
    timerValue: 0,
    testResults: []
  }

  componentDidMount() {
    this.selectNextPerson()
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
    //DEBUG console.log(`${randFreq}: ${quizPerson.performance.frequencyOffsetStart} / ${quizPerson.performance.frequencyOffsetEnd}`)
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

  addTestResult(result: number) {
    const testResult: TestResult = {
      guid: this.state.quizPerson!.guid,
      result
    }
    this.setState({
      testResults: [...this.state.testResults, testResult]
    })
  }

  @OF.autobind
  onClickKnow() {
    this.addTestResult(this.state.timerValue)
    this.selectNextPerson()
  }

  @OF.autobind
  onClickDontKnow() {
    this.addTestResult(MAX_TIME)
    this.selectNextPerson()
    this.clearTimer()
  }

  @OF.autobind
  onClickQuestion() {
    this.clearTimer()
    this.setState({
      showName: true
    })
  }

  @OF.autobind
  onClickQuit() {
    this.clearTimer()
    this.state.testResults.map(tr =>
      console.log(JSON.stringify(tr)))
    this.props.onQuizDone(this.state.testResults/* PerfType*/)
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
      const newTime = this.state.timerValue + timerInterval
      if (newTime <= MAX_TIME) {
        this.setState({
          timerValue: this.state.timerValue + timerInterval
        })
      }
      else {
        this.clearTimer()
        this.setState({
          showName: true
        })
      }
    }, timerInterval)

    this.setState({
      timerId
    })
  }

  private TimerFontColor(timerValue: number): string
  {
      const color = 255*((timerValue-25)/100)
      return `rgb(${color}, ${color}, ${color})`
  }

  private TimerBackgroundColor(timerValue: number): string
  {
      let r: number
      let g: number

      if (timerValue <= 50)
      {
          r = 255;
      }
      else
      {
          r = (255*(1-(timerValue-50.0)/50))
      }

      if (timerValue > 50)
      {
          g = 255
      }
      else
      {
          g = (255*(timerValue/50))
      }

      return `rgb(${r}, ${g}, 0)`
  }

  public render() {
    const overrideStyles = OF.mergeStyles({
      backgroundColor: this.TimerBackgroundColor(100-(this.state.timerValue/100)),
      color: this.TimerFontColor(this.state.timerValue/100),
      width: "50px",
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: "15px",
      fontSize: "20px",
      marginTop: "13px",
      height: "30px",
      borderRadius: "5px"
    });

    if (!this.state.quizPerson) {
      return null
    }
    const imageFile = baseImage + this.state.quizPerson.blobNames[this.state.imageIndex]
    return (
      <div className="QuizPage">
        <div
          className={overrideStyles}>
          {this.state.timerValue/100}
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
          <div>
            <div
              className='QuizName'>
              {this.state.quizPerson.fullName}
            </div>
            <div
              className='QuizDescription'>
              {this.state.quizPerson.description}
            </div>
            <OF.IconButton
              className="ButtonIcon ButtonPrimary"
              onClick={()=> this.props.onViewDetail(this.state.quizPerson!)}
              iconProps={{ iconName: 'DrillDownSolid' }}
            />
          </div>
        }
        <div
          className="ContentFooter">
          <OF.IconButton
            className="ButtonIcon FloatLeft"
            onClick={this.onClickKnow}
            iconProps={{ iconName: 'LikeSolid' }}
          />
          <OF.IconButton
              className="ButtonIcon ButtonPrimary"
              onClick={this.onClickQuit}
              iconProps={{ iconName: 'ChromeClose' }}
            />
          {this.state.showName ? 
            <OF.IconButton
              className="ButtonIcon  ButtonPrimary FloatRight"
              onClick={this.onClickDontKnow}
              iconProps={{ iconName: 'DislikeSolid' }}
            /> :
            <OF.IconButton
              className="ButtonIcon  ButtonPrimary FloatRight"
              onClick={this.onClickQuestion}
              iconProps={{ iconName: 'UnknownSolid' }}
            />
          }
        </div>
      </div>
    )
  }
}

export default QuizPage;
