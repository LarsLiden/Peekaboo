/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'

export interface ReceivedProps {
  title: string
  image?: string
  onConfirm?: () => void,
  onCancel?: () => void
}

class Confirm extends React.Component<ReceivedProps, {}> {

  public render() {
    return (
      <div className="ModalPage">
        <div className="ModalBodyText">
          {this.props.title}
        </div>
        {this.props.image && 
            <OF.Image
              className="ConfirmImageHolder"
              src={this.props.image}
              width={100}
              height={100}
            />
        }
        <div
          className="ContentFooter"
        > 
          {this.props.onConfirm &&
            <OF.IconButton
                className="ButtonIcon ButtonPrimary"
                onClick={this.props.onConfirm}
                iconProps={{ iconName: 'LikeSolid' }}
            />
          }
          {this.props.onCancel &&
            <OF.IconButton
                className="ButtonIcon ButtonPrimary"
                onClick={this.props.onCancel}
                iconProps={{ iconName: 'DislikeSolid' }}
            />
          }
        </div>
      </div>
    );
  }
}

export default Confirm;
