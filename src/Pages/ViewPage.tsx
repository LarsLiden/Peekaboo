/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import '../fabric.css'
import { Person } from '../models/person'
import { Filter, FilterSet, User, Tag } from '../models/models'
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
import ResizeText from '../modals/ResizeText'
import { Page } from '../App'
import "./ViewPage.css"
import { MAX_TIME } from '../models/const';
import { SubPage } from './EditPage';

const SWIPE_THRESHOLD = 50

export interface ReceivedProps {
  filterSet: FilterSet | null
  person: Person
  user: User
  allPeople: Person[]
  allTags: Tag[]
  filter: Filter
  personList: string[]
  onSetPage: (page: Page, backpage: Page | null, subPage: SubPage | null) => void
  onClickQuiz: () => void
  onContinueQuiz: () => void
  onEdit: () => void
  onClickTagFilter: () => void
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
      xMove: position.x,
      yMove: position.y
    })
    console.log(`Moved ${position.x} pixels horizontally`, event);
    console.log(`Moved ${position.y} pixels vertically`, event);
  }
 
  @OF.autobind
  onSwipeEnd(event: any) {
    if (this.state.xMove > SWIPE_THRESHOLD && Math.abs(this.state.yMove) < SWIPE_THRESHOLD) {
      this.onPrevPerson()
    }
    else if (this.state.xMove < -SWIPE_THRESHOLD && Math.abs(this.state.yMove) < SWIPE_THRESHOLD) {
      this.onNextPerson()
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
    let creationDate = new Date(this.props.person.creationDate).toLocaleDateString()
                  
    return (
        <Swipe
          onSwipeStart={this.onSwipeStart}
          onSwipeEnd={this.onSwipeEnd}
          onSwipeMove={this.onSwipeMove}
        >
        <div className="ModalPage">
          <div className="HeaderHolder HeaderHolderTall">
            <div className="HeaderContent HeaderNoPadding">
              <div className="ViewBodyNameColumn">      
                <div className="DetailName">
                  {this.props.person.firstName}
                </div>
                <div className="DetailName DetailPhonetic">
                  {this.props.person.firstPhonetic}
                </div>
                {this.props.person.nickName &&
                  <ResizeText
                    text={`"${this.props.person.nickName}"`}
                    maxWidth={130}
                  />
                }
                <div className="DetailName">
                    {this.props.person.lastName}
                </div>
                <div className="DetailName DetailPhonetic">
                  {this.props.person.lastPhonetic}
                </div>
                {this.props.person.maidenName &&
                  <div className="DetailName">
                    {`(${this.props.person.maidenName})`}
                  </div>
                }
                {this.props.user.isAdmin &&
                  <div
                      className={`ButtonListCount${inList ? ' ButtonListCountSelected' : ''}`}
                      onClick={this.props.onAddToPersonList}
                      role="button"
                  >
                    {this.props.personList.length.toString()}
                  </div>
                }
                <div
                  className="CreationDate"
                >
                  {creationDate}
                </div>
                <div 
                  className="ViewScale" 
                  onClick={() => this.props.onSetPage(Page.PERFORMANCE, Page.VIEW, null)}
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
            <div className="ModalBodyContent ModalBodyHeaderHolderTall ModalBodyHeaderHolderTallBottom">
              <DetailSocialNetworks
                person={this.props.person}
                onSetPage={this.props.onSetPage}
              />
              <DetailText title="Alt Name" text={this.props.person.alternateName} isLong={true}/>          
              <DetailText title="Description" text={this.props.person.description} isLong={true}/>
              <DetailTags 
                tagIds={this.props.person.tagIds}
                allTags={this.props.allTags}
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
                  {(this.props.filter.requiredTagIds.length > 0 || this.props.filter.blockedTagIds.length > 0 || this.props.filter.searchTerm !== null) 
                    ?
                    <OF.IconButton
                      className="ButtonIcon ButtonPrimary FloatLeft ButtonOutlined"
                      onClick={() => this.props.onClickTagFilter()}
                      iconProps={{ iconName: 'FilterSolid' }}
                    />
                    :
                    <OF.IconButton
                      className="ButtonIcon ButtonPrimary FloatLeft"
                      onClick={() => this.props.onClickTagFilter()}
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
                      onClick={() => this.props.onSetPage(Page.SEARCH, Page.VIEW, null)}
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
                <OF.Button
                    className="ButtonIcon ButtonPrimary"
                    onClick={this.props.onContinueQuiz}
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
          }
      </div>
        </Swipe>
    );
  }
}

export default ViewPage;
