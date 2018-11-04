import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import './fabric.css'
import { Page } from './App'
import DetailIndexer from './DetailIndexer'
import { LibraryPerson, LibrarySet, Filter } from './models/models'

export interface ReceivedProps {
  librarySet: LibrarySet | null
  filter: Filter
  onNext: () => void
  onPrev: () => void
  onClickQuiz: () => void
  onClickFilter: () => void
  onViewLibraryPerson: (returnPage: Page) => void
}

const baseImage = "https://peekaboo.blob.core.windows.net/faces/"

interface ComponentState { 
  currentPerson: LibraryPerson | null
}

class LibraryPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    currentPerson: null
  }

  componentDidMount() {
    
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

    const libraryPerson = this.props.librarySet.libraryPeople[this.props.librarySet.selectedIndex]
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
                width={160}
                height={160}
              />
              <DetailIndexer
                onPrev={this.props.onPrev}
                onNext={this.props.onNext}
                currentIndex={this.props.librarySet.selectedIndex}
                total={this.props.librarySet.libraryPeople.length}
              />
              <OF.DefaultButton
                className="ButtonThin"
                onClick={() => this.props.onViewLibraryPerson(Page.LIBRARY)}
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
