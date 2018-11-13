/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import 'react-image-crop/dist/ReactCrop.css'

export interface ReceivedProps {
  title: string
  onConfirm: () => void,
  onCancel: () => void
}

class Confirm extends React.Component<ReceivedProps, {}> {

  public render() {
    return (
      <div className="ModalPage">
        <div className="ModalBodyText">
          {this.props.title}
        </div>
        <div
          className="ContentFooter">
          <OF.IconButton
              className="ButtonIcon ButtonPrimary"
              onClick={this.props.onConfirm}
              iconProps={{ iconName: 'LikeSolid' }}
          />
          <OF.IconButton
              className="ButtonIcon ButtonPrimary"
              onClick={this.props.onCancel}
              iconProps={{ iconName: 'DislikeSolid' }}
          />
        </div>
      </div>
    );
  }
}

export default Confirm;
