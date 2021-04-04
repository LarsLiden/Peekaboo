/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import '../fabric.css'
import './Detail.css'
import * as OF from 'office-ui-fabric-react'
import { autobind } from 'core-decorators'

export interface ReceivedProps {
  label: string
  value: string
  rows?: number
  multiline?: boolean
  autoFocus?: boolean
  maxLength?: number
  minLength?: number
  onEnter?: (text: string) => void
  onChanged: (text: string | undefined) => void
}

class DetailEditText extends React.Component<ReceivedProps, {}> {

  onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {

    if (this.props.maxLength && this.props.value.length > this.props.maxLength) {
      return
    }

    if (this.props.onEnter) {
      // On enter attempt to create the entity as long as name is set
      if (event.key === 'Enter' && this.props.value !== "") {
          this.props.onEnter(this.props.value)
      }
    }
  }

  @autobind
  getErrorMessage(value: string): string {
    let text = value.trim()
    if (this.props.maxLength && text.length > this.props.maxLength) {
      return `Must be less than ${this.props.maxLength} letters.`
    }
    else if (this.props.minLength && text.length < this.props.minLength) {
      return `Required Value`
    }
    return ''
  }

  public render() {

    return (
      <div className={`DetailText AlignLeft"}`}>
        <div className="DetailTitle DetailTitlePlain">
          {this.props.label}
        </div>
        <OF.TextField
          multiline={this.props.multiline || false}
          rows={this.props.rows || 1} 
          autoFocus={this.props.autoFocus || false}
          resizable={false}
          className="DetailTextField"
          underlined={true}
          onGetErrorMessage={this.getErrorMessage}
          onChange={(event, text) => this.props.onChanged(text)}
          onKeyDown={this.props.onEnter ? this.onKeyDown : undefined}
          value={this.props.value}
        />   
      </div>

    );
  }
}

export default DetailEditText;
