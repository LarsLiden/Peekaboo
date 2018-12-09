/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import '../fabric.css'
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
    this.props.onCreate(this.state.tagName)
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
              />
            </div>
          </div>
          <div className="FooterHolder"> 
            <div className="FooterContent">
              <OF.IconButton
                  disabled={!this.state.tagName}
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
