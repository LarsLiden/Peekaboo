import * as React from 'react';
//import * as OF from 'office-ui-fabric-react'
import './fabric.css'

export interface ReceivedProps {
  title: string
  text: string
}

interface ComponentState { 
  inEditMode: boolean
}

class DetailText extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    inEditMode: false
  }

  public render() {

      return (
        <div className="DetailText">
          <div className="DetailTitle">
            {this.props.title}
          </div>
          <div className="DetailBody">
            {this.props.text}
          </div>
        </div>

    );
  }
}

export default DetailText;
