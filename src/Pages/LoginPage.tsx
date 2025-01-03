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
import { autobind } from 'core-decorators'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const VERSION = "0.27"

export interface ReceivedProps {
  onLoginComplete: (user: User) => void
}

interface ComponentState {
  waitingCalloutText: string | null;
  userLoginValue: string;
  loginDisable: boolean;
}

class LoginPage extends React.Component<ReceivedProps, ComponentState> {

  private _startButtonElement = React.createRef<HTMLElement>();

  state: ComponentState = {
    waitingCalloutText: null,
    userLoginValue: "",
    loginDisable: false
  }

  @autobind
  private async loginSuccess(response: any) {
    this.setState({loginDisable: true})
    try {
      const profile = response.profileObj;
      let user: User = {
        googleId: profile.googleId,
        name: profile.name,
        email: profile.email
      }

      localStorage.setItem('user', JSON.stringify(user))
    
      try {
        let foundUser = await Client.LOGIN(user)
        
        if (foundUser) {
          this.props.onLoginComplete(foundUser)
        }
      }
      catch (error) {
        this.setState({
          waitingCalloutText: error.response.statusText,
          loginDisable: false
        })
      }
    }
    catch (error) {
      this.setState({
        waitingCalloutText: "Login Failure",
        loginDisable: false
      })
    }
  }

  @autobind
  private onWaitCalloutDismiss(): void {
    this.setState({waitingCalloutText: null})
  }

  public render() {
  
    return (
      <div className="ModalPage">
      <div 
        className="ModalBodyHolder TopMarginZero"
        style={{
        backgroundImage: `url(${HEAD_IMAGE})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain'
        }}
      >
      {!this.state.loginDisable &&
        <GoogleOAuthProvider clientId="757831696321-kdog1rehu946i1ch7rb3pvmf5r3rr2r4.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={this.loginSuccess}
            onFailure={() => {}}
            buttonText="Have We Met?"
            className="LoginButton"
          />
        </GoogleOAuthProvider>
      }
      <div className="LoginVersion">{VERSION}</div>
      </div>
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
