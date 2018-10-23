import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { Person } from './models/person'

export interface ReceivedProps {
  person: Person
  onClose: () => void
}

interface ComponentState {
}

class DetailPage extends React.Component<ReceivedProps, ComponentState> {

  componentDidMount() {
    
  }

  @OF.autobind
  onClickCancel() {
    this.props.onClose()
  }

  
  public render() {
  
    return (
      <div className="FilterPage">
        <OF.DefaultButton
            className="QuizButton"
            onClick={this.onClickCancel}
            text="Close"
        />  
      </div>
    );
  }
}

export default DetailPage;
