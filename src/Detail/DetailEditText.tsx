/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import '../fabric.css'
import './Detail.css'
import * as OF from 'office-ui-fabric-react'

export interface ReceivedProps {
  label: string
  value: string
  onChanged: (text: string) => void
}

class DetailText extends React.Component<ReceivedProps, {}> {

  public render() {

    return (
      <div className={`DetailText AlighnLeft"}`}>
        <div className="DetailTitle DetailEditTitle">
          {this.props.label}
        </div>
        <OF.TextField
          underlined={true}
          onChanged={text => this.props.onChanged(text)}
          value={this.props.value}
        />   
      </div>

    );
  }
}

export default DetailText;
