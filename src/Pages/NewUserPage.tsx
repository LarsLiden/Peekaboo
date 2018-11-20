/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
 /* tslint:disable */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'

export interface ReceivedProps {
  onClickImport: () => void
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
        <OF.IconButton
          className="ButtonIcon ButtonPrimary"
          onClick={this.props.onClickImport}
          iconProps={{ iconName: 'CloudDownload' }}
        />
      </div>
    )
  }
}

export default NewUserPage;
