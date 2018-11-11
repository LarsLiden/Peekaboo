import * as React from 'react';
//import * as OF from 'office-ui-fabric-react'
import '../fabric.css'
import './Detail.css'

export interface ReceivedProps {
  title: string
  text: string
  isLong?: boolean
  alignRight?: boolean
}

interface ComponentState { 
  inEditMode: boolean
}

class DetailText extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    inEditMode: false
  }

  public render() {
    if (!this.props.text) {
      return null
    }
    const bodyClass = this.props.isLong ? "DetailLongBody" : "DetailBody"
    return (
      <div className={`DetailText ${this.props.alignRight ? "AlignRight" : "AlighnLeft"}`}>
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
