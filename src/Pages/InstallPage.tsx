/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'

export interface ReceivedProps {
  onConfirm: () => void,
  onCancel: () => void
}

class InstallPage extends React.Component<ReceivedProps, {}> {

  public render() {
    return (
      <div className="ModalPage">
        <div className="ConfirmTitle">
          Install Have We Met?
        </div>
        <div className="ConfirmSubtitle">
          Improve your experience by installing on your device
        </div>
        <div className="FooterHolder"> 
          <div className="FooterContent"> 
            {this.props.onConfirm &&
              <OF.IconButton
                  className="ButtonIcon ButtonPrimary FloatLeft"
                  onClick={this.props.onConfirm}
                  iconProps={{ iconName: 'LikeSolid' }}
              />
            }
            {this.props.onCancel &&
              <OF.IconButton
                  className="ButtonIcon ButtonPrimary FloatRight"
                  onClick={this.props.onCancel}
                  iconProps={{ iconName: 'DislikeSolid' }}
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default InstallPage;
