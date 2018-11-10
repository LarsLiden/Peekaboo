import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import './fabric.css'
import { Person } from '../models/person'
import { Filter } from '../models/models'
import { FilterSet} from '../models/models'
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
  filter: Filter
  onClickQuiz: () => void
  onContinueQuiz: () => void
  onEdit: () => void
  onClickFilter: () => void
  onNextPerson: () => void
  onPrevPerson: () => void
}

const baseImage = "https://peekaboo.blob.core.windows.net/faces/"

interface ComponentState { 
  photoIndex: number
}

class ViewPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    photoIndex: 0
  }

  componentDidMount() {
    
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
      if (photoIndex <= 0) {
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
    const imageFile = baseImage + this.props.person.photoFilenames[this.state.photoIndex]
      return (
        <div className="QuizPage">
          <div className="ViewBodyTop">
            <div className="ViewBodyNameColumn">
              <DetailText title="First Name" text={this.props.person.firstName}/>
              <DetailText title="Last Name" text={this.props.person.lastName}/>
              <DetailText title="Nickname" text={this.props.person.nickName}/>
              <DetailText title="Maiden Name" text={this.props.person.maidenName}/>
              <DetailTags 
                tags={this.props.person.tags}
                filter={this.props.filter}
              />
            </div>
            <div className="ViewImageColumn">
              <OF.Image
                className="QuizImageHolder"
                src={imageFile}
                width={160}
                height={160}
              />
              <DetailIndexer
                onPrev={this.onPrevPhoto}
                onNext={this.onNextPhoto}
                currentIndex={this.state.photoIndex}
                total={this.props.person.photoFilenames.length}
              />
            </div>
          </div>
          <div className="ViewBodyBottom">
            <DetailText title="Description" text={this.props.person.description} isLong={true}/>
          </div>
          <div className="ViewBodyBottom">
            <DetailRelationships
              relationships={this.props.person.relationships}
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
        <div>
        </div>
        {this.props.filterSet 
        ?
          <div
            className="ViewFooter">
            <OF.IconButton
                className="ImageButton"
                onClick={() => this.props.onClickFilter()}
                iconProps={{ iconName: 'Filter' }}
            />
            <DetailIndexer
              onPrev={this.onPrevPerson}
              onNext={this.onNextPerson}
              currentIndex={this.props.filterSet.selectedIndex}
              total={this.props.filterSet.libraryPeople.length}
            />
            <OF.IconButton
                className="ImageButton"
                onClick={() => this.props.onClickQuiz()}
                iconProps={{ iconName: 'Unknown' }}
            />
          </div>
        :
          <div
            className="ViewFooter">
            <OF.IconButton
              className="IconButtonLarge"
              onClick={this.props.onContinueQuiz}
              iconProps={{ iconName: 'ChromeClose' }}
            />
          </div>
        }
        <OF.IconButton
          className="IconButtonLarge ButtonCorner"
          onClick={this.props.onEdit}
          iconProps={{ iconName: 'EditSolid12' }}
        />
      </div>
    );
  }
}

export default ViewPage;
