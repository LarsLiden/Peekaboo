/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { User, FilterSet } from '../models/models'
import ConfirmModal from '../modals/Confirm'
import Client from '../service/client'

export interface ReceivedProps {
  user: User
  users: User[]
  filterSet: FilterSet
  onDeleteUser: (user: User) => {}
  onExportToUser: (user: User) => {}
  onImport: () => {}
  onClose: () => {}
  onLogin: (user: User) => {} 
}

interface ComponentState {
  isConfirmDeleteUser: User | null
  isConfirmExportToUser: User | null
  isConfirmImportOpen: boolean
}

class AdminPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    isConfirmDeleteUser: null,
    isConfirmExportToUser: null,
    isConfirmImportOpen: false
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

  // --- EXPORT TO USER ---
  @OF.autobind
  onExportToUser(user: User): void {
    this.setState({isConfirmExportToUser: user})
  }

  @OF.autobind
  onCancelExportToUser(): void {
    this.setState({isConfirmExportToUser: null})
  }

  @OF.autobind
  async onConfirmExportToUser(): Promise<void> {
    if (this.state.isConfirmExportToUser) {
      await this.props.onExportToUser(this.state.isConfirmExportToUser)
      this.setState({
        isConfirmExportToUser: null
      })
    }
  }

  // --- IMPORT TO SELF ---
  @OF.autobind
  onClickImport(): void {
    this.setState({isConfirmImportOpen: true})
  }

  @OF.autobind
  onCancelImport(): void {
    this.setState({isConfirmImportOpen: false})
  }

  @OF.autobind
  async onConfirmImport(): Promise<void> {
      await this.props.onImport()
      this.setState({
        isConfirmImportOpen: false
      })
  }

  @OF.autobind
  async onLoginAs(user: User) {
    let foundUser = await Client.Login(user)
    
    if (foundUser) {
      foundUser.isSpoof = true
      this.props.onLogin(foundUser)
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
          <div className={`AdminUserText${user.isAdmin || user.googleId === "sample" ? ' SearchBold' : ''}`}>
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
          <div className="AdminUserText">
            {user.numPeople} - {user.numPhotos} - {user.numTestResults}
          </div>
          {user.googleId !== this.props.user.googleId &&
            <div className="AdminButtons">
              <OF.IconButton 
                disabled={user.googleId === "sample"}
                className="ButtonIcon ButtonDark FloatRight"
                onClick={() => this.onDeleteUser(user)}
                iconProps={{ iconName: 'Delete' }}
              />
              <OF.IconButton
                className="ButtonIcon ButtonDark FloatRight"
                onClick={() => this.onExportToUser(user)}
                iconProps={{ iconName: 'IncreaseIndentLegacy' }}
              />
              <OF.IconButton
                className="ButtonIcon ButtonDark FloatRight"
                onClick={() => this.onLoginAs(user)}
                iconProps={{ iconName: 'FollowUser' }}
              />
            </div>
          }
        </div>
      </div>
    );
  }

  public render() {
    return (
      <div className="ModalPage">
        <div className="HeaderHolder">
          <div className="HeaderContent">
            Admin
          </div>
        </div>
        <div className="ModalBodyHolder">
          <div className="ModalBodyContent">
            <OF.List
              items={this.props.users}
              onRenderCell={this.onRenderCell}
            />
          </div>
        </div>
        <div className="FooterHolder">
          <div className="FooterContent" >
            <OF.IconButton
                className="ButtonIcon ButtonPrimary FloatLeft"
                onClick={this.onClickClose}
                iconProps={{ iconName: 'ChromeBack' }}
            />
            <OF.IconButton
              className="ButtonIcon ButtonPrimary FloatRight"
              onClick={this.onClickImport}
              iconProps={{ iconName: 'IncreaseIndentLegacy' }}
            />  
          </div>
        </div>
        {this.state.isConfirmDeleteUser &&
          <ConfirmModal
            title="Are you sure you want to delete"
            subtitle={this.state.isConfirmDeleteUser.name}
            onCancel={this.onCancelDeleteUser}
            onConfirm={this.onConfirmDeleteUser}
          />
        }
        {this.state.isConfirmExportToUser &&
          <ConfirmModal
            title={`Are you sure you want to export ${this.props.filterSet.people.length} people to`}
            subtitle={this.state.isConfirmExportToUser.name}
            onCancel={this.onCancelExportToUser}
            onConfirm={this.onConfirmExportToUser}
          />
        }
        {this.state.isConfirmImportOpen &&
          <ConfirmModal
            title={`Are you sure you want to start the import?`}
            onCancel={this.onCancelImport}
            onConfirm={this.onConfirmImport}
          />
        }
      </div>
    );
  }
}

export default AdminPage;
