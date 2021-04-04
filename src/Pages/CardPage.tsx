/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import '../fabric.css'
import { Person } from "../models/person";
import { QuizPerson, QuizSet, User } from '../models/models'
//import ScaledColor from '../modals/ScaledColor'
import { getRandomInt, /*PHOTO_HEIGHT, PHOTO_WIDTH, baseBlob*/ } from '../Util'
import { TestResult } from '../models/performance'
import { autobind } from 'core-decorators'

export interface ReceivedProps {
  user: User
  quizSet: QuizSet | null
  hidden: boolean
  allPeople: Person[]
  onQuizDone: (testResults: TestResult[]) => Promise<void>
  onViewDetail: (quizperson: QuizPerson) => void
}

interface ComponentState {
  quizPeople: QuizPerson[],
  photoIndexes: number[],
  photoBlobNames: string[],
  showName: boolean,
  testResults: TestResult[]
}
/*
const WIDTH = 3
const HEIGHT = 4
*/
class CardPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    quizPeople: [],
    photoIndexes: [],
    photoBlobNames: [],
    showName: false,
    testResults: []
  }

  componentDidUpdate() {
    // Check the quizPerson is still in the set (may have been archived)
    if (this.props.quizSet && this.state.quizPeople) {
      //LARSif (!this.props.quizSet.quizPeople.find(q => q.personId === this.state.quizPeople!.personId)) {
       //LARS this.selectNextPerson()
      //LARS}
    }
  }

  componentDidMount() {
    //LARSthis.selectNextPerson()
  }

  // Pick a random person from the test set based on testing frequency
  getRandomPerson(): QuizPerson | null {
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

  //  let quizPerson = this.props.quizSet.quizPeople[personIndex]
/* TODO, no duplicates
    // Pick one nearby rather than repeating last quized person
    if (quizPerson === this.state.quizPeople) {
      personIndex = (personIndex > 0) ? personIndex - 1 : personIndex + 1
      quizPerson = this.props.quizSet.quizPeople[personIndex]
    }

    return quizPerson
    */
   return null
  }
  
  selectNextPerson(index: number): void {
/*
    const quizPerson = this.getRandomPerson()
    const photoIndex = getRandomInt(0, quizPerson.photoBlobnames.length - 1)
    const photoBlobName = baseBlob(this.props.user) + quizPerson.photoBlobnames[photoIndex]

    const quizPeople = [...this.state.quizPeople]
    const photoIndexes = [...this.state.photoIndexes]
    const photoBlobNames = [...this.state.photoBlobNames]

    quizPeople[index] = quizPerson
    photoIndexes[index] = photoIndex
    photoBlobNames[index] = photoBlobName

    this.setState({
      quizPeople,
      photoIndexes,
      photoBlobNames
    })
    */
  }

  @autobind
  onClickKnow(index: number) {
    this.selectNextPerson(index)
  }

  @autobind
  onClickQuestion() {
    this.setState({
      showName: true
    })
  }

  @autobind
  onClickQuit() {
    this.props.onQuizDone(this.state.testResults/* PerfType*/)
  }

  @autobind
  onImageLoaded() {
    // If I'm just reloading the page after showing user, don't re-start timer
    if (this.state.showName) {
      return
    }
  }

  public render() {

    if (!this.state.quizPeople || this.props.hidden) {
      return null
    }/*
    let width = 250
    let height = (PHOTO_HEIGHT / PHOTO_WIDTH) * width
*/
    return null
    /*
    return (
      <div className="QuizPage">
        <ScaledColor
          scale={100}
        />
        <div className="grid"> 
        {this.state.photoBlobNames.map((bn, i) => 
          <OF.Image
            key={bn}
            className="QuizImageHolder"
            src={bn}
            width={width}
            height={height}
            onLoad={this.onImageLoaded}
            onClick={() => this.onClickKnow(i)}
          />
        )
        }
        </div>
        {this.state.showName && 
          <div className='QuizShow'>
            <div className='ExpandedName'>
              {this.state.quizPeople[0].expandedName}
            </div>
          </div>
        }
        <div className="FooterHolder">
          <div className="FooterContent">
            <OF.IconButton
              className="ButtonIcon ButtonPrimary FloatLeft"
              onClick={this.onClickKnow}
              iconProps={{ iconName: 'LikeSolid' }}
            />
            {this.state.showName ? 
              <OF.IconButton
                className="ButtonIcon ButtonPrimary"
                onClick={() => this.props.onViewDetail(this.state.quizPeople!)}
                iconProps={{ iconName: 'ContactInfo' }}
              />
            :
              <OF.IconButton
                className="ButtonIcon ButtonPrimary"
                onClick={this.onClickQuit}
                iconProps={{ iconName: 'ChromeClose' }}
              />
            }
            {this.state.showName ? 
              <OF.IconButton
                className="ButtonIcon  ButtonPrimary FloatRight"
                onClick={this.onClickDontKnow}
                iconProps={{ iconName: 'DislikeSolid' }}
              /> :
              <OF.IconButton
                className="ButtonIcon  ButtonPrimary FloatRight"
                onClick={this.onClickQuestion}
                iconProps={{ iconName: 'Help' }}
              />
            }
          </div>
        </div>
      </div>
    )*/
  }
}

export default CardPage
