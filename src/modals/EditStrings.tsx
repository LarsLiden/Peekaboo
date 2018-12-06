/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import '../fabric.css'
import { Person } from '../models/person'
import { generateSaveName } from '../Util'
import DetailEditText from '../Detail/DetailEditText'
import "../Pages/ViewPage.css"

export interface ReceivedProps {
  person: Person
  onSave: (person: Person) => void
  onCancel: () => void
}

interface ComponentState { 
  firstName: string
  lastName: string
  nickName: string
  maidenName: string
  alternateName: string
  description: string
}

class EditStrings extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    firstName: "",
    lastName: "",
    nickName: "",
    maidenName: "",
    alternateName: "",
    description: "",
  }

  componentDidMount() {
    this.updateAppState(this.props.person)
  }

  updateAppState(person: Person) {
    this.setState({
        firstName: person.firstName,
        lastName: person.lastName,
        nickName: person.nickName,
        maidenName: person.maidenName,
        alternateName: person.alternateName,
        description: person.description
    })
  }

  @OF.autobind
  onFirstNameChanged(text: string) {
    //TODO - delete
    this.setState({firstName: text})
  }

  @OF.autobind
  onLastNameChanged(text: string) {
      this.setState({lastName: text})
  }

  @OF.autobind
  onNickNameChanged(text: string) {
    this.setState({nickName: text})
  }

  @OF.autobind
  onMaidenNameChanged(text: string) {
    this.setState({maidenName: text})
  }

  @OF.autobind
  onAlternativeNameChanged(text: string) {
    this.setState({alternateName: text})
  }

  @OF.autobind
  onDescriptionNameChanged(text: string) {
    this.setState({description: text})
  }
  
  @OF.autobind
  onClickSave(): void {

    let newPerson = new Person({...this.props.person})
    newPerson.firstName = this.state.firstName
    newPerson.lastName = this.state.lastName
    newPerson.nickName = this.state.nickName
    newPerson.maidenName = this.state.maidenName
    newPerson.alternateName = this.state.alternateName
    newPerson.description = this.state.description

    if (!this.props.person.personId) {
      // TODO: check for duplicates when creating new name
      newPerson.personId = generateSaveName(this.state.firstName, this.state.lastName)
    }
    this.props.onSave(newPerson)
  }

  @OF.autobind
  onClickCancel(): void {
    this.props.onCancel()
  }

  public render() {
    return (
      <div className="ModalPage">
          <div className="HeaderHolder">
            <div className="HeaderContent">
              Basic Info
            </div>
          </div>
          <div className="ModalBody">
            <DetailEditText
              label="First Name"
              onChanged={text => this.onFirstNameChanged(text)}
              value={this.state.firstName}
            />
            <DetailEditText
              label="Last Name"
              onChanged={text => this.onLastNameChanged(text)}
              value={this.state.lastName}
            />
            <DetailEditText
              label="Nickname"
              onChanged={text => this.onNickNameChanged(text)}
              value={this.state.nickName}
            />    
            <DetailEditText
              label="Maiden Name"
              onChanged={text => this.onMaidenNameChanged(text)}
              value={this.state.maidenName}
            />
            <DetailEditText
              label="Alternate Name"
              onChanged={text => this.onAlternativeNameChanged(text)}
              value={this.state.alternateName}
            />
            <DetailEditText
              // multiline={true}
              // rows={4}
              label="Description"
              onChanged={text => this.onDescriptionNameChanged(text)}
              value={this.state.description}
            />
          </div>
          <div className="FooterHolder"> 
            <div className="FooterContent">
              <OF.IconButton
                  className="ButtonIcon ButtonPrimary FloatLeft"
                  onClick={this.onClickSave}
                  iconProps={{ iconName: 'Save' }}
              />
              <OF.IconButton
                  className="ButtonIcon ButtonPrimary FloatRight"
                  onClick={this.onClickCancel}
                  iconProps={{ iconName: 'ChromeClose' }}
              />
            </div>
          </div>
      </div>
    );
  }
}

export default EditStrings;
