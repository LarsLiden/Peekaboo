/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { HEAD_IMAGE } from '../Util'
import { autobind } from 'core-decorators'

export interface ReceivedProps {
  onClose: () => void
}

interface ComponentState {
  isFooterVisible: boolean
}

class NewUserPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    isFooterVisible: true
  }
  
  @autobind
  onClickDone() {
    this.setState({isFooterVisible: false})
    this.props.onClose()
  }

  public render() {
  
    return (
      <div className="ModalPage">
        <div 
          className="ModalBodyHolder TopMarginZero"
          style={{
              backgroundImage: `url(${HEAD_IMAGE})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }}
        >
          <div className="ModalBodyContent">
            <div>
              <div className="NewUserText1">
                Remembering names and faces
              </div>
              <div className="NewUserText2">
                (and things about people you've met)
              </div>
            </div>
          </div>
        </div>
        <div className="FooterHolder"> 
          <div 
            className="FooterContent"
            hidden={!this.state.isFooterVisible}
          >
            <div className="NewUserText3">
              We've pre-populated your account with a few sample people so you can get a feel for how it works.
            </div>
            <OF.IconButton
                className="ButtonIcon ButtonPrimary FloatRight"
                onClick={this.onClickDone}
                iconProps={{ iconName: 'LikeSolid' }}
            />
          </div>
        </div>
      </div>
    )
  };
}

export default NewUserPage;
