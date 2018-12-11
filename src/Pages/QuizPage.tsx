/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import '../fabric.css'
import { QuizPerson, QuizSet, User } from '../models/models'
import ScaledColor from '../modals/ScaledColor'
import { getRandomInt, PHOTO_HEIGHT, PHOTO_WIDTH, baseBlob } from '../Util'
import { TestResult } from '../models/performance'
import { MAX_TIME } from '../models/const'

export interface ReceivedProps {
  user: User
  quizSet: QuizSet | null
  onQuizDone: (testResults: TestResult[]) => Promise<void>
  onViewDetail: (quizperson: QuizPerson) => void
}

const timerInterval = 100

interface ComponentState {
  quizPerson: QuizPerson | null,
  photoIndex: number,
  showName: boolean,
  timerId: NodeJS.Timer | null,
  timerValue: number,
  testResults: TestResult[]
}

class QuizPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    quizPerson: null,
    photoIndex: 0,
    showName: false,
    timerId: null,
    timerValue: 0,
    testResults: []
  }

  componentDidMount() {
    this.selectNextPerson()
  }

  // Pick a random person from the test set based on testing frequency
  getRandomPerson(): QuizPerson {
    if (!this.props.quizSet) {
      throw new Error("Missing Quizset")
    }
    if (this.props.quizSet.quizPeople.length === 1) {
        return this.props.quizSet.quizPeople[0]
    }

    const randFreq = getRandomInt(0, this.props.quizSet.frequencyTotal - 1)

    let personIndex = this.props.quizSet.quizPeople.findIndex(qp => {
        return (randFreq >= qp.performance.frequencyOffsetStart && randFreq < qp.performance.frequencyOffsetEnd)
      }
    )

    if (personIndex === -1) {
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
    const photoIndex = getRandomInt(0, quizPerson.photoBlobnames.length - 1)

    this.setState({
      showName: false,
      quizPerson,
      photoIndex
    })
  }

  addTestResult(result: number) {
    const testResult: TestResult = {
      personId: this.state.quizPerson!.personId,
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
    const timerId = setInterval(() => {
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

  public render() {

    if (!this.state.quizPerson) {
      return null
    }
    let width = 250
    let height = (PHOTO_HEIGHT / PHOTO_WIDTH) * width

    const photoBlobname = baseBlob(this.props.user) + this.state.quizPerson.photoBlobnames[this.state.photoIndex]

    return (
      <div className="QuizPage">
        <ScaledColor
          scale={this.state.timerValue / 100}
        />
        <OF.Image
          className="QuizImageHolder"
          src={photoBlobname}
          width={width}
          height={height}
          //imageFit={OF.ImageFit.center}
          onLoad={this.onImageLoaded}
        />
        {this.state.showName && 
          <div>
            <div className='QuizName'>
              {this.state.quizPerson.fullName}
            </div>
            <div className='QuizDescription'>
              {this.state.quizPerson.description}
            </div>
            <OF.IconButton
              className="ButtonIcon ButtonPrimary"
              onClick={() => this.props.onViewDetail(this.state.quizPerson!)}
              iconProps={{ iconName: 'DrillDownSolid' }}
            />
          </div>
        }
        <div className="FooterHolder">
          <div className="FooterContent">
            <OF.IconButton
              className="ButtonIcon ButtonPrimary FloatLeft"
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
      </div>
    )
  }
}

export default QuizPage;
