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
import Search from '../modals/Search'
import ViewPerformance from '../modals/ViewPerformance'
import ScaledColor from '../modals/ScaledColor'
import DetailText from '../Detail/DetailText'
import DetailTags from '../Detail/DetailTags'
import DetailIndexer from '../Detail/DetailIndexer'
import DetailRelationships from '../Detail/DetailRelationships'
import DetailEvents from '../Detail/DetailEvents'
import DetailKeyValues from '../Detail/DetailKeyValues'
import DetailSocialNetworks from '../Detail/DetailSocialNetworks'
import "./ViewPage.css"
import { MAX_TIME } from '../models/const';

export interface ReceivedProps {
  filterSet: FilterSet | null
  person: Person
  user: User
  allPeople: Person[]
  filter: Filter
  onClickQuiz: () => void
  onContinueQuiz: () => void
  onEdit: () => void
  onClickFilter: () => void
  onClickSort: () => void
  onNewPerson: () => void
  onNextPerson: () => void
  onPrevPerson: () => void
  onSelectPerson: (guid: string) => void
}

interface ComponentState { 
  photoIndex: number
  isSearchOpen: boolean
  isViewPerformanceOpen: boolean
}

class ViewPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    photoIndex: 0,
    isSearchOpen: false,
    isViewPerformanceOpen: false
  }

  // --- Search ---
  @OF.autobind
  onCloseSearch(): void {
    this.setState({isSearchOpen: false})
  }

  @OF.autobind
  onSelectSearch(person:  Person): void {
    this.setState({
      isSearchOpen: false
    })
    this.props.onSelectPerson(person.guid)
  }

  @OF.autobind
  onClickSearch(): void {
    this.setState({isSearchOpen: true})
  }

  // --- Performance ---
  @OF.autobind
  onCloseViewPerformance(): void {
    this.setState({isViewPerformanceOpen: false})
  }

  @OF.autobind
  onClickViewPerformance(): void {
    this.setState({isViewPerformanceOpen: true})
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

  public render() {
    let photoBlobName = HEAD_IMAGE
    if (this.props.person.photoFilenames.length > 0) {
      photoBlobName = baseBlob(this.props.user) 
        + getPhotoBlobName(this.props.person, this.props.person.photoFilenames[this.state.photoIndex])
    }
    let width = 160
    let height = (PHOTO_HEIGHT / PHOTO_WIDTH) * width
    let scale = 100 - Math.round((1 - (this.props.person.photoPerformance.avgTime / MAX_TIME)) * 100)
    return (
      <div>
        <div className="ViewPage">
          <div className="ContentHeader">
            <div className="ViewBodyNameColumn">      
              <DetailText className="DetailName" text={this.props.person.firstName}/>
              {this.props.person.nickName &&
                <DetailText className="DetailName" text={`"${this.props.person.nickName}"`}/>
              }
              <DetailText className="DetailName" text={this.props.person.lastName}/>
              <div 
                className="ViewScale" 
                onClick={this.onClickViewPerformance}
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
          <div className="ContentBody">
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
          {this.props.filterSet 
          ?
            <div>
              <div className="ViewIndexer">
                <DetailIndexer
                  isVertical={false}
                  onPrev={this.onPrevPerson}
                  onNext={this.onNextPerson}
                  currentIndex={this.props.filterSet.selectedIndex}
                  total={this.props.filterSet.people.length}
                />
              </div>
              <div
                className="ContentFooter"
              >
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
                    onClick={() => this.onClickSearch()}
                    iconProps={{ iconName: 'Search' }}
                />
                <OF.IconButton
                    className="ButtonIcon ButtonPrimary FloatLeft"
                    onClick={() => this.props.onNewPerson()}
                    iconProps={{ iconName: 'CirclePlus' }}
                />
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
          :
            <div
              className="ContentFooter"
            >
              <OF.IconButton
                className="ButtonIcon ButtonPrimary"
                onClick={this.props.onContinueQuiz}
                iconProps={{ iconName: 'ChromeClose' }}
              />
            </div>
          }
        </div>
        {this.state.isSearchOpen &&
          <Search
            people={this.props.allPeople}
            onCancel={this.onCloseSearch}
            onSelect={this.onSelectSearch}
          />
        }
        {this.state.isViewPerformanceOpen &&
          <ViewPerformance
            performance={this.props.person.photoPerformance}
            onClose={this.onCloseViewPerformance}
          />
        }
      </div>
    );
  }
}

export default ViewPage;
