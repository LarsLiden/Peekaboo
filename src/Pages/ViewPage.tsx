import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import '../fabric.css'
import { Person } from '../models/person'
import { Filter } from '../models/models'
import { FilterSet} from '../models/models'
import { HEAD_IMAGE } from '../Util'
import Search from '../modals/Search'
import DetailText from '../Detail/DetailText'
import DetailTags from '../Detail/DetailTags'
import DetailIndexer from '../Detail/DetailIndexer'
import DetailRelationships from '../Detail/DetailRelationships'
import DetailEvents from '../Detail/DetailEvents'
import DetailKeyValues from '../Detail/DetailKeyValues'
import DetailSocialNetworks from '../Detail/DetailSocialNetworks'
import "./ViewPage.css"

export interface ReceivedProps {
  filterSet: FilterSet | null
  person: Person
  allPeople: Person[]
  filter: Filter
  onClickQuiz: () => void
  onContinueQuiz: () => void
  onEdit: () => void
  onClickFilter: () => void
  onNextPerson: () => void
  onPrevPerson: () => void
  onSelectPerson: (guid: string) => void
}

const baseImage = "https://peekaboo.blob.core.windows.net/faces/"

interface ComponentState { 
  photoIndex: number
  isSearchOpen: boolean
}

class ViewPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    photoIndex: 0,
    isSearchOpen: false
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
    const imageFile = this.props.person.photoFilenames.length > 0
      ? baseImage + this.props.person.photoFilenames[this.state.photoIndex]
      : HEAD_IMAGE

      return (
        <div>
          <div className="ViewPage">
            <div className="ContentHeader">
              <div className="ViewImageColumn">
                <OF.Image
                  className="QuizImageHolder"
                  src={imageFile}
                  width={160}
                  height={160}
                />
                <DetailIndexer
                  isVertical={true}
                  onPrev={this.onPrevPhoto}
                  onNext={this.onNextPhoto}
                  currentIndex={this.state.photoIndex}
                  total={this.props.person.photoFilenames.length}
                />
              </div>
              <div className="ViewBodyNameColumn">
                <DetailText title="First Name" alignRight={true} text={this.props.person.firstName}/>
                <DetailText title="Last Name" alignRight={true} text={this.props.person.lastName}/>
                <DetailText title="Nickname" alignRight={true} text={this.props.person.nickName}/>
                <OF.IconButton
                  className="ButtonIcon ButtonBottomRight ButtonDark"
                  onClick={this.props.onEdit}
                  iconProps={{ iconName: 'EditSolid12' }}
                />
              </div>
            </div>
            <div className="ContentBody">
              <DetailText title="Description" text={this.props.person.description} isLong={true}/>
              <DetailText title="Description" text={this.props.person.alternateName} isLong={true}/>
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
              <div
                className="ContentFooter">
                <OF.IconButton
                    className="ButtonIcon ButtonPrimary"
                    onClick={() => this.props.onClickFilter()}
                    iconProps={{ iconName: 'Filter' }}
                />
                <DetailIndexer
                  isVertical={false}
                  onPrev={this.onPrevPerson}
                  onNext={this.onNextPerson}
                  currentIndex={this.props.filterSet.selectedIndex}
                  total={this.props.filterSet.people.length}
                />
                <OF.IconButton
                    className="ButtonIcon ButtonPrimary"
                    onClick={() => this.onClickSearch()}
                    iconProps={{ iconName: 'Search' }}
                />
                <OF.IconButton
                    className="ButtonIcon ButtonPrimary"
                    onClick={() => this.props.onClickQuiz()}
                    iconProps={{ iconName: 'Unknown' }}
                />
              </div>
            :
              <div
                className="ContentFooter">
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
      </div>
    );
  }
}

export default ViewPage;
