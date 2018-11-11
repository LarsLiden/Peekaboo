import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import Client from '../service/client'
import { StartState } from '../models/models'

export interface ReceivedProps {
  onLoginComplete: () => void
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
  private userNameChanged(text: string) {
    this.setState({
      userLoginValue: text
    })
  }

  @OF.autobind
  onLoginKeyDown(event: React.KeyboardEvent<HTMLElement>) {
      // On enter attempt to create the model if required fields are set
      // Not on import as explicit button press is required to pick the file
      if (event.key === 'Enter' && this.state.userLoginValue) {
          this.onClickLogin();
      }
  }

  @OF.autobind
  private async onClickLogin(): Promise<void> {
    let startState = await Client.start(this.state.userLoginValue)
    if (startState === StartState.READY) {
      this.props.onLoginComplete()
    }
    else if (startState === StartState.WAITING) {
      this.setState({
        waitingCalloutText: "Server is warming up"
      })
    }
    else {
      this.setState({
        waitingCalloutText: "Not found"
      })
    }
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
        src="https://peekaboo.blob.core.windows.net/resources/HaveWeHead.png"
        imageFit={OF.ImageFit.cover}
        maximizeFrame={true}
      />
      <div
        ref={this._startButtonElement}>
        <OF.TextField
            className="LoginTextInput"
            value={this.state.userLoginValue}
            onChanged={this.userNameChanged}
            onKeyDown={key => this.onLoginKeyDown(key)}
        />
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
    );
  }
}

export default LoginPage;
