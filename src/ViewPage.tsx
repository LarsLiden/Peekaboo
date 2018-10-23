import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import './fabric.css'
import { Page } from './App'
import { Person } from './models/person'
import { Filter } from './models/models'
import DetailText from './DetailText'
import DetailRelationship from './DetailRelationships'
import "./ViewPage.css"

export interface ReceivedProps {
  person: Person
  filter: Filter
  returnPage: Page
  onClose: (returnPage: Page) => void
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
  onClickNext(): void {
  
    let photoIndex = this.state.photoIndex + 1
    if (photoIndex >= this.props.person.photoFilenames.length) {
      photoIndex = 0
    }
    this.setState({photoIndex})

  }

  @OF.autobind
  onClickPrevious(): void {
      let photoIndex = this.state.photoIndex - 1
      if (photoIndex <= 0) {
        photoIndex = this.props.person.photoFilenames.length - 1
      }
      this.setState({photoIndex})
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
            </div>
            <div className="ViewImageColumn">
              <OF.Image
                className="QuizImageHolder"
                src={imageFile}
                width={125}
                height={125}
              />
              <OF.IconButton
                className="ImageButton"
                onClick={this.onClickPrevious}
                iconProps={{ iconName: 'CaretLeftSolid8' }}
              />
              <div className="LibraryImageCount">
                {`${this.state.photoIndex+1}/${this.props.person.photoFilenames.length}`}
              </div>
              <OF.IconButton
                className="ImageButton"
                onClick={this.onClickNext}
                iconProps={{ iconName: 'CaretRightSolid8' }}
              />
            
            </div>
          </div>
          <div className="ViewBodyBottom">
            <DetailRelationship
              relationships={this.props.person.relationships}
            />
          </div>
        <div>
          <OF.DefaultButton
            className="QuizButton"
            onClick={() => this.props.onClose(this.props.returnPage)}
            text="Close"
          />
        </div>
      </div>
    );
  }
}

export default ViewPage;
