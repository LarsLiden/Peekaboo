/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import '../fabric.css'
import { isValid, MAX_TAG_LENGTH } from '../Util'
import DetailEditText from '../Detail/DetailEditText'
import "../Pages/ViewPage.css"

export interface ReceivedProps {
  onCreate: (tag: string) => void
  onCancel: () => void
}

interface ComponentState { 
  tagName: string
}

class AddTag extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    tagName: ""
  }

  @OF.autobind
  onTagNameChanged(text: string) {
    this.setState({tagName: text})
  }
  
  @OF.autobind
  onClickSave(): void {
    if (isValid(this.state.tagName, 1, MAX_TAG_LENGTH)) {
      this.props.onCreate(this.state.tagName)
    }
  }

  @OF.autobind
  onClickCancel(): void {
    this.props.onCancel()
  }

  public render() {
    return (
      <div className="ModalPage">
          <div className="HeaderHolder">
            <div className="HeaderContent">
              Create Tag
            </div>
          </div>
          <div className="ModalBodyHolder">
            <div className="ModalBodyContent">
              <DetailEditText
                label="New Tag"
                onChanged={text => this.onTagNameChanged(text)}
                value={this.state.tagName}
                onEnter={this.onClickSave}
                autoFocus={true}
                maxLength={MAX_TAG_LENGTH}
              />
            </div>
          </div>
          <div className="FooterHolder"> 
            <div className="FooterContent">
              <OF.IconButton
                  disabled={!isValid(this.state.tagName, 1, MAX_TAG_LENGTH)}
                  className="ButtonIcon ButtonPrimary FloatLeft"
                  onClick={this.onClickSave}
                  iconProps={{ iconName: 'Save' }}
              />
              <OF.IconButton
                  className="ButtonIcon ButtonPrimary FloatRight"
                  onClick={this.onClickCancel}
                  iconProps={{ iconName: 'ChromeClose' }}
              />
            </div>
          </div>
      </div>
    );
  }
}

export default AddTag;
