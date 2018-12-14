/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import '../fabric.css'
import { Person } from '../models/person'
import { Filter, FilterSet, User } from '../models/models'
import { HEAD_IMAGE, baseBlob, getPhotoBlobName, PHOTO_HEIGHT, PHOTO_WIDTH } from '../Util'
import ScaledColor from '../modals/ScaledColor'
import DetailText from '../Detail/DetailText'
import DetailTags from '../Detail/DetailTags'
import DetailIndexer from '../Detail/DetailIndexer'
import DetailRelationships from '../Detail/DetailRelationships'
import DetailEvents from '../Detail/DetailEvents'
import DetailKeyValues from '../Detail/DetailKeyValues'
import DetailSocialNetworks from '../Detail/DetailSocialNetworks'
import Swipe from 'react-easy-swipe'
import { Page } from '../App'
import "./ViewPage.css"
import { MAX_TIME } from '../models/const';

export interface ReceivedProps {
  filterSet: FilterSet | null
  person: Person
  user: User
  allPeople: Person[]
  filter: Filter
  personList: string[]
  onSetPage: (page: Page, backpage: Page | null) => void
  onClickQuiz: () => void
  onContinueQuiz: () => void
  onEdit: () => void
  onClickFilter: () => void
  onClickSort: () => void
  onClickAdmin: () => void
  onNewPerson: () => void
  onNextPerson: () => void
  onPrevPerson: () => void
  onAddToPersonList: () => void
  onSelectPerson: (personId: string) => void
}

interface ComponentState { 
  photoIndex: number
  xMove: number
  yMove: number
}

class ViewPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    photoIndex: 0,
    xMove: 0,
    yMove: 0
  }

  @OF.autobind
  onNextPhoto(): void {
  
    let photoIndex = this.state.photoIndex + 1
    if (photoIndex >= this.props.person.photoFilenames.length) {
      photoIndex = 0
    }
    this.setState({photoIndex})

  }

  @OF.autobind
  onPrevPhoto(): void {
      let photoIndex = this.state.photoIndex - 1
      if (photoIndex < 0) {
        photoIndex = this.props.person.photoFilenames.length - 1
      }
      this.setState({photoIndex})
  }
  
  @OF.autobind
  onNextPerson(): void {
    this.setState({photoIndex: 0})
    this.props.onNextPerson()
  }

  @OF.autobind
  onPrevPerson(): void {
    this.setState({photoIndex: 0})
    this.props.onPrevPerson()
  }

  @OF.autobind
  onSwipeStart(event: any) {
    this.setState({
      xMove: 0,
      yMove: 0
    })
    console.log('Start swiping...', event);
  }
 
  @OF.autobind
  onSwipeMove(position: any, event: any) {
    this.setState({
      xMove: this.state.xMove + position.x,
      yMove: this.state.yMove + position.y
    })
    console.log(`Moved ${position.x} pixels horizontally`, event);
    console.log(`Moved ${position.y} pixels vertically`, event);
  }
 
  @OF.autobind
  onSwipeEnd(event: any) {
    if (this.state.xMove > 50) {
      this.onNextPerson()
    }
    else if (this.state.xMove < 50) {
      this.onPrevPerson()
    }
  }

  public render() {
    let photoBlobName = HEAD_IMAGE
    if (this.props.person.photoFilenames.length > 0) {
      photoBlobName = baseBlob(this.props.user) 
        + getPhotoBlobName(this.props.person, this.props.person.photoFilenames[this.state.photoIndex])
    }
    let width = 160
    let height = (PHOTO_HEIGHT / PHOTO_WIDTH) * width
    let scale = 100 - Math.round((1 - (this.props.person.photoPerformance.avgTime / MAX_TIME)) * 100)
    let inList = this.props.personList.find(p => p === this.props.person.personId)
      
    return (
        <Swipe
          onSwipeEnd={this.onSwipeEnd}>
        <div className="ModalPage">
          <div className="HeaderHolder HeaderHolderTall">
            <div className="HeaderContent HeaderNoPadding">
              <div className="ViewBodyNameColumn">      
                <DetailText className="DetailName" text={this.props.person.firstName}/>
                {this.props.person.nickName &&
                  <DetailText className="DetailName" text={`"${this.props.person.nickName}"`}/>
                }
                <DetailText className="DetailName" text={this.props.person.lastName}/>
                {this.props.user.isAdmin &&
                  <OF.Button
                      className={`ButtonIcon ButtonListCount${inList ? ' ButtonListCountSelected' : ''}`}
                      onClick={this.props.onAddToPersonList}
                      text={this.props.personList.length.toString()}
                  />
                }
                <div 
                  className="ViewScale" 
                  onClick={() => this.props.onSetPage(Page.PERFORMANCE, Page.VIEW)}
                  role="button"
                >
                  <ScaledColor
                    scale={scale}
                  />
                </div> 
              </div>
              <div className="ViewImageColumn">
                <OF.Image
                  className="QuizImageHolder"
                  src={photoBlobName}
                  width={width}
                  height={height}
                />
                <div className="InlineBlock">
                  <DetailIndexer
                    isVertical={true}
                    onPrev={this.onPrevPhoto}
                    onNext={this.onNextPhoto}
                    currentIndex={this.state.photoIndex}
                    total={this.props.person.photoFilenames.length}
                  />
                  <OF.IconButton
                      className="ButtonIcon ButtonDark"
                      onClick={this.props.onEdit}
                      iconProps={{ iconName: 'EditSolid12' }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="ModalBodyHolder">
            <div className="ModalBodyContent ModalBodyHeaderHolderTall">
              <DetailText title="Alt Name" text={this.props.person.alternateName} isLong={true}/>          
              <DetailText title="Description" text={this.props.person.description} isLong={true}/>
              <DetailTags 
                tags={this.props.person.tags}
                filter={this.props.filter}
              />
              <DetailRelationships
                relationships={this.props.person.relationships}
                allPeople={this.props.allPeople}
                onSelectPerson={this.props.onSelectPerson}
              />
              <DetailEvents
                events={this.props.person.events}
              />
              <DetailKeyValues
                keyValues={this.props.person.keyValues}
              />
              <DetailSocialNetworks
                socialNets={this.props.person.socialNets}
              />
            </div>
          </div>
          {this.props.filterSet 
          ?
            <div>
              <div className="IndexerHolder">
                <div className="IndexerContent">
                  <DetailIndexer
                    isVertical={false}
                    onPrev={this.onPrevPerson}
                    onNext={this.onNextPerson}
                    currentIndex={this.props.filterSet.selectedIndex}
                    total={this.props.filterSet.people.length}
                  />
                </div>
              </div>
              <div className="FooterHolder"> 
                <div className="FooterContent">
                  {(this.props.filter.required.length > 0 || this.props.filter.blocked.length > 0) 
                    ?
                    <OF.IconButton
                      className="ButtonIcon ButtonPrimary FloatLeft ButtonOutlined"
                      onClick={() => this.props.onClickFilter()}
                      iconProps={{ iconName: 'FilterSolid' }}
                    />
                    :
                    <OF.IconButton
                      className="ButtonIcon ButtonPrimary FloatLeft"
                      onClick={() => this.props.onClickFilter()}
                      iconProps={{ iconName: 'Filter' }}
                    />
                  }

                  <OF.IconButton
                      className="ButtonIcon ButtonPrimary FloatLeft"
                      onClick={() => this.props.onClickSort()}
                      iconProps={{ iconName: 'SortLines' }}
                  />
                  <OF.IconButton
                      className="ButtonIcon ButtonPrimary FloatLeft"
                      onClick={() => this.props.onSetPage(Page.SEARCH, Page.VIEW)}
                      iconProps={{ iconName: 'Search' }}
                  />
                  <OF.IconButton
                      className="ButtonIcon ButtonPrimary FloatLeft"
                      onClick={() => this.props.onNewPerson()}
                      iconProps={{ iconName: 'CirclePlus' }}
                  />
                  {this.props.user.isAdmin &&
                    <OF.IconButton
                        className="ButtonIcon ButtonPrimary FloatLeft"
                        onClick={() => this.props.onClickAdmin()}
                        iconProps={{ iconName: 'Settings' }}
                    />
                  }
                  <OF.Button
                      className="ButtonIcon ButtonPrimary FloatRight"
                      onClick={() => this.props.onClickQuiz()}
                  >
                    <OF.Image
                      className="QuizImageHolder"
                      src={"https://peekaboo.blob.core.windows.net/resources/quizicon.png"}
                      width={100}
                      height={30}
                    />
                  </OF.Button>
                </div>
              </div>
            </div>
          :
            <div className="FooterHolder"> 
              <div className="FooterContent">
                <OF.IconButton
                  className="ButtonIcon ButtonPrimary"
                  onClick={this.props.onContinueQuiz}
                  iconProps={{ iconName: 'ChromeClose' }}
                />
              </div>
            </div>
          }
      </div>
        </Swipe>
    );
  }
}

export default ViewPage;
