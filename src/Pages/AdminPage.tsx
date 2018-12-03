/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { User } from '../models/models'
import Client from '../service/client'

export interface ReceivedProps {
  user: User
  onClose: () => {}
}

interface ComponentState {
  users: User[]
}

class AdminPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    users: []
  }

  async componentDidMount() {
    let users = await Client.getUsers(this.props.user) 
    this.setState({users})
  }

  @OF.autobind
  onClickClose() {
    this.props.onClose()
  }

  @OF.autobind
  onRenderCell(user: any, index: number, isScrolling: boolean): JSX.Element {
    let joined = new Date(user.createdDateTime).toLocaleDateString()
    let last = new Date(user.lastUsedDatTime).toLocaleDateString()
    return (
      <div className="FilterLine">
        <div className='AdminUserSection'>
          <div className={`AdminUserText${user.isAdmin ? ' SearchBold' : ''}`}>
            {user.name}
          </div>
          <div className="AdminUserText">
            {user.email}
          </div>
          <div className="AdminUserText">
            {user.googleId}
          </div>
          <div className="AdminUserText">
            {joined} - {last}
          </div>
          <OF.IconButton
            className="ButtonIcon ButtonDark FloatRight"
            //onClick={() => this.onClickDelete(keyValue)}
            iconProps={{ iconName: 'Delete' }}
        />
        </div>
      </div>
    );
  }

  public render() {
    return (
      <div className="ModalPage">
        <div className="ContentHeader FilterHeader">
          Admin
        </div>
        <div className="ModalBody">
          <OF.List
            className="FilterList"
            items={this.state.users}
            onRenderCell={this.onRenderCell}
          />
        </div>
        <div className="ContentFooter" >
          <OF.IconButton
              className="ButtonIcon ButtonPrimary FloatLeft"
              onClick={this.onClickClose}
              iconProps={{ iconName: 'ChromeBack' }}
          />
        </div>
      </div>
    );
  }
}

export default AdminPage;
