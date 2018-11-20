/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
 /* tslint:disable */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import Client from '../service/client'
import { HEAD_IMAGE } from '../Util'
import { User } from '../models/models'
import GoogleLogin from 'react-google-login';

export interface ReceivedProps {
  onLoginComplete: (user: User) => void
}

interface ComponentState {
  waitingCalloutText: string | null
  userLoginValue: string
}

class LoginPage extends React.Component<ReceivedProps, ComponentState> {

  private _startButtonElement = OF.createRef<HTMLElement>();

  state: ComponentState = {
    waitingCalloutText: null,
    userLoginValue: ""
  }

  @OF.autobind
  private async loginSuccess(googleUser: any) {
    let profile = googleUser.getBasicProfile();
    let user: User = {
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail()
    }
    let foundUser = await Client.Login(user)
    
    if (foundUser) {
      this.props.onLoginComplete(foundUser)
    }
    else {
      this.setState({
        waitingCalloutText: "Login Failure"
      })
    }

    //console.log('Image URL: ' + profile.getImageUrl());
    //console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

  @OF.autobind
  private onWaitCalloutDismiss(): void {
    this.setState({waitingCalloutText: null})
  }

  public render() {
  
    return (
      <div
      className="LoginPage"
    >
      <OF.Image className="LoginImage"
        src={HEAD_IMAGE}
        imageFit={OF.ImageFit.cover}
        maximizeFrame={true}
      />
      <GoogleLogin
        className="LoginButton"
        clientId="757831696321-kdog1rehu946i1ch7rb3pvmf5r3rr2r4.apps.googleusercontent.com"
        buttonText="Have We Met?"
        onSuccess={this.loginSuccess}
        onFailure={()=>{}}
      />
      <OF.Callout
          role={'alertdialog'}
          gapSpace={0}
          calloutWidth={200}
          backgroundColor={'#555555'}
          target={this._startButtonElement.current}
          onDismiss={this.onWaitCalloutDismiss}
          setInitialFocus={true}
          hidden={this.state.waitingCalloutText === null}
        >
          <div className="ms-CalloutExample-header AppCallout">
            <p className="ms-CalloutExample-title" id={'callout-label-1'}>
              {this.state.waitingCalloutText}
            </p>
          </div>
        </OF.Callout>
    </div>
    )
  }
}

export default LoginPage;
