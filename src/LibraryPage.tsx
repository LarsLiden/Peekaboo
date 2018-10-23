import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import './fabric.css'
import { Page } from './App'
import { LibraryPerson, LibrarySet, Filter } from './models/models'

export interface ReceivedProps {
  librarySet: LibrarySet | null
  filter: Filter
  initialGuid: string | null
  onClickQuiz: () => void
  onClickFilter: () => void
  onClickPerson: (quid: string, returnPage: Page) => void
}

const baseImage = "https://peekaboo.blob.core.windows.net/faces/"

interface ComponentState { 
  currentPerson: LibraryPerson | null,
  personIndex: number
}

class LibraryPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    currentPerson: null,
    personIndex: 0,
  }

  componentDidMount() {
    
  }

  componentWillMount() {
    if (this.props.initialGuid && this.props.librarySet) {
        let personIndex = this.props.librarySet.libraryPeople.findIndex(p => p.guid === this.props.initialGuid)
        if (personIndex < 0) {
          personIndex = 0
        }
        this.setState({ personIndex } )
    }
  }

  @OF.autobind
  onClickNext(): void {
    if (this.props.librarySet) {
      let personIndex = this.state.personIndex + 1
      if (personIndex >= this.props.librarySet.libraryPeople.length) {
        personIndex = 0
      }
      this.setState({personIndex})
    }
  }

  @OF.autobind
  onClickPrevious(): void {
    if (this.props.librarySet) {
      let personIndex = this.state.personIndex - 1
      if (personIndex <= 0) {
        personIndex = this.props.librarySet.libraryPeople.length - 1
      }
      this.setState({personIndex})
    }
  }

  @OF.autobind
  private onRenderCell(tag: string, index: number, isScrolling: boolean): JSX.Element {
    const isSelected = this.props.filter.required.find(r => r === tag)
    if (isSelected) {
      return (
        <div className="LibraryTagSelected">{tag}</div>
      )
    }
    else {
      return (
        <div className="LibraryTagUnselected">{tag}</div>
      )
    }
  }

  public render() {
    if (!this.props.librarySet) {
      return null
    }

    const libraryPerson = this.props.librarySet.libraryPeople[this.state.personIndex]
    const imageFile = baseImage + libraryPerson.blobName
      return (
        <div className="QuizPage">
          <div className="LibraryBody">
            <div className="LibraryImageColumn">
              <div className="LibraryImageTitle">
                {libraryPerson.fullName}
              </div>
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
                {`${this.state.personIndex+1}/${this.props.librarySet.libraryPeople.length}`}
              </div>
              <OF.IconButton
                className="ImageButton"
                onClick={this.onClickNext}
                iconProps={{ iconName: 'CaretRightSolid8' }}
              />
              <OF.DefaultButton
                className="ButtonThin"
                onClick={() => this.props.onClickPerson(libraryPerson.guid, Page.LIBRARY)}
                text="View"
              /> 
            </div>
            <div className="LibraryTagsColumn">
              <OF.List
                className="LibraryTagList"
                items={libraryPerson.tags}
                onRenderCell={this.onRenderCell}
              />
              <OF.DefaultButton
                className="ButtonThin"
                onClick={this.props.onClickFilter}
                text="Filter"
              /> 
            </div>
        </div>
        <div>
          <OF.DefaultButton
            className="QuizButton"
            onClick={this.props.onClickQuiz}
            text="Quiz"
          />
        </div>
      </div>
    );
  }
}

export default LibraryPage;
