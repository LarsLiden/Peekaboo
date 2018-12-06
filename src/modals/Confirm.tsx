/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'

export interface ReceivedProps {
  title: string
  subtitle?: string
  image?: string
  onConfirm?: () => void,
  onCancel?: () => void
}

class Confirm extends React.Component<ReceivedProps, {}> {

  public render() {
    return (
      <div className="ModalPage">
        <div className="ConfirmTitle">
          {this.props.title}
        </div>
        {this.props.subtitle && 
          <div className="ConfirmSubtitle">
            {this.props.subtitle}
          </div>
        }
        {this.props.image && 
            <OF.Image
              className="ConfirmImageHolder"
              src={this.props.image}
              width={100}
              height={100}
            />
        }
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

export default Confirm;
