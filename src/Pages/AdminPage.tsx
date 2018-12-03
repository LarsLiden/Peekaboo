/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { User } from '../models/models'
import ConfirmModal from '../modals/Confirm'

export interface ReceivedProps {
  user: User
  users: User[]
  onDeleteUser: (user: User) => {}
  onClose: () => {}
}

interface ComponentState {
  isConfirmDeleteUser: User | null
}

class AdminPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    isConfirmDeleteUser: null
  }

  // --- DELETE USER ---
  @OF.autobind
  onDeleteUser(user: User): void {
    this.setState({isConfirmDeleteUser: user})
  }

  @OF.autobind
  onCancelDeleteUser(): void {
    this.setState({isConfirmDeleteUser: null})
  }

  @OF.autobind
  async onConfirmDeleteUser(): Promise<void> {
    if (this.state.isConfirmDeleteUser) {
      await this.props.onDeleteUser(this.state.isConfirmDeleteUser)
      this.setState({
        isConfirmDeleteUser: null
      })
    }
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
          {user.googleId !== this.props.user.googleId &&
            <OF.IconButton
              className="ButtonIcon ButtonDark FloatRight"
              onClick={() => this.onDeleteUser(user)}
              iconProps={{ iconName: 'Delete' }}
            />
          }
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
            items={this.props.users}
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
        {this.state.isConfirmDeleteUser &&
        <ConfirmModal
          title="Are you sure you want to delete"
          subtitle={this.state.isConfirmDeleteUser.name}
          onCancel={this.onCancelDeleteUser}
          onConfirm={this.onConfirmDeleteUser}
        />
      }
      </div>
    );
  }
}

export default AdminPage;
