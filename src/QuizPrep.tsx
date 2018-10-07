import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { Tag } from './models/models'

export interface ReceivedProps {
  tags: Tag[]
  onClose: (tag: string | null) => Promise<void>
}

interface ComponentState {
}

class QuizPrep extends React.Component<ReceivedProps, ComponentState> {

  componentDidMount() {
    
  }

  @OF.autobind
  onClickCancel() {
    this.props.onClose(null)
  }

  @OF.autobind
  onClickQuiz() {
    this.props.onClose("test")
  }

  public render() {
  
    return (
      <div className="App">
        <OF.List
          className="ms-ListGridExample"
          items={this.props.tags}
       //   getItemCountForPage={this._getItemCountForPage}
       //   getPageHeight={this._getPageHeight}
       //   renderedWindowsAhead={4}
       //   onRenderCell={this._onRenderCell}
        />
        <OF.DefaultButton
            onClick={this.onClickCancel}
            text="Cancel"
        />  
        <OF.DefaultButton
            onClick={this.onClickQuiz}
            text="Quiz"
        />
      </div>
    );
  }
}

export default QuizPrep;
