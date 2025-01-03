/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import '../fabric.css'
import { Person } from '../models/person'
import { autobind } from 'core-decorators'
import DetailEditText from '../Detail/DetailEditText'
import "../Pages/ViewPage.css"

export interface ReceivedProps {
  person: Person;
  allPeople: Person[];
  onSave: (person: Person) => void;
  onCancel: () => void;
}

interface ComponentState { 
  firstName: string;
  firstPhonetic: string;
  lastName: string;
  lastPhonetic: string;
  nickName: string;
  maidenName: string;
  alternateName: string;
  description: string;
}

class EditBasicInfo extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    firstName: "",
    firstPhonetic: "",
    lastName: "",
    lastPhonetic: "",
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
        firstPhonetic: person.firstPhonetic,
        lastName: person.lastName,
        lastPhonetic: person.lastPhonetic,
        nickName: person.nickName,
        maidenName: person.maidenName,
        alternateName: person.alternateName,
        description: person.description
    })
  }

  @autobind
  onFirstNameChanged(text: string | undefined) {
    this.setState({firstName: text || ""})
  }

  @autobind
  onFirstPhoneticChanged(text: string | undefined) {
    this.setState({firstPhonetic: text || ""})
  }

  @autobind
  onLastNameChanged(text: string | undefined) {
      this.setState({lastName: text || ""})
  }

  @autobind
  onLastPhoneticChanged(text: string | undefined) {
    this.setState({lastPhonetic: text || ""})
  }

  @autobind
  onNickNameChanged(text: string | undefined) {
    this.setState({nickName: text || ""})
  }

  @autobind
  onMaidenNameChanged(text: string | undefined) {
    this.setState({maidenName: text || ""})
  }

  @autobind
  onAlternativeNameChanged(text: string | undefined) {
    this.setState({alternateName: text || ""})
  }

  @autobind
  onDescriptionNameChanged(text: string | undefined) {
    this.setState({description: text || ""})
  }

  @autobind
  onClickSave(): void {

    let newPerson = new Person({...this.props.person})
    newPerson.firstName = this.state.firstName
    newPerson.firstPhonetic = this.state.firstPhonetic
    newPerson.lastName = this.state.lastName
    newPerson.lastPhonetic = this.state.lastPhonetic
    newPerson.nickName = this.state.nickName
    newPerson.maidenName = this.state.maidenName
    newPerson.alternateName = this.state.alternateName
    newPerson.description = this.state.description

    this.props.onSave(newPerson)
  }

  @autobind
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
          <div className="ModalBodyHolder">
            <div className="ModalBodyContent">
              <DetailEditText
                label="First Name"
                onChanged={text => this.onFirstNameChanged(text)}
                value={this.state.firstName}
                autoFocus={true}
              />
              <DetailEditText
                label="First Phonetic"
                onChanged={text => this.onFirstPhoneticChanged(text)}
                value={this.state.firstPhonetic}
              />  
              <DetailEditText
                label="Last Name"
                onChanged={text => this.onLastNameChanged(text)}
                value={this.state.lastName}
              />
              <DetailEditText
                label="Last Phonetic"
                onChanged={text => this.onLastPhoneticChanged(text)}
                value={this.state.lastPhonetic}
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
                multiline={true}
                rows={4}
                label="Description"
                onChanged={text => this.onDescriptionNameChanged(text)}
                value={this.state.description}
              />
            </div>
          </div>
          <div className="FooterHolder"> 
            <div className="FooterContent">
              <OF.IconButton
                  disabled={!this.state.firstName || !this.state.lastName}
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

export default EditBasicInfo;
