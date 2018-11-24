/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { HEAD_IMAGE } from '../Util'

export interface ReceivedProps {
  onClose: () => void
}

interface ComponentState {
  waitingCalloutText: string | null
  userLoginValue: string
}

class NewUserPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    waitingCalloutText: null,
    userLoginValue: ""
  }

  public render() {
  
    return (
      <div
        className="LoginPage"
      >
        <OF.Image 
          className="LoginImage"
          src={HEAD_IMAGE}
          imageFit={OF.ImageFit.cover}
          maximizeFrame={true}
        />
        <OF.DefaultButton
            className="QuizButton"
            onClick={this.props.onClose}
            text="Import"
        />  
      </div>
    )
  }
}

export default NewUserPage;
