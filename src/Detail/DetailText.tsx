import * as React from 'react';
//import * as OF from 'office-ui-fabric-react'
import './fabric.css'
import './Detail.css'

export interface ReceivedProps {
  title: string
  text: string
  isLong?: boolean
}

interface ComponentState { 
  inEditMode: boolean
}

class DetailText extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    inEditMode: false
  }

  public render() {

      const bodyClass = this.props.isLong ? "DetailLongBody" : "DetailBody"
      return (
        <div className="DetailText">
          <div className="DetailTitle">
            {this.props.title}
          </div>
          <div className={bodyClass}>
            {this.props.text || "-"}
          </div>
        </div>

    );
  }
}

export default DetailText;
