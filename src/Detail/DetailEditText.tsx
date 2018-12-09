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
  rows?: number
  multiline?: boolean
  autoFocus?: boolean
  onEnter?: (text: string) => void
  onChanged: (text: string) => void
}

class DetailText extends React.Component<ReceivedProps, {}> {

  onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (this.props.onEnter) {
      // On enter attempt to create the entity as long as name is set
      if (event.key === 'Enter' && this.props.value !== "") {
          this.props.onEnter(this.props.value)
      }
    }
}

  public render() {

    return (
      <div className={`DetailText AlignLeft"}`}>
        <div className="DetailTitle DetailEditTitle">
          {this.props.label}
        </div>
        <OF.TextField
          multiline={this.props.multiline || false}
          rows={this.props.rows || 1} 
          autoFocus={this.props.autoFocus || false}
          resizable={false}
          className="DetailTextField"
          underlined={true}
          onChanged={text => this.props.onChanged(text)}
          onKeyDown={this.props.onEnter ? this.onKeyDown : undefined}
          value={this.props.value}
        />   
      </div>

    );
  }
}

export default DetailText;
