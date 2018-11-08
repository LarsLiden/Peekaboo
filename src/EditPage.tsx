import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import './fabric.css'
import { Person } from './models/person'
import { Filter } from './models/models'
import DetailTags from './DetailTags'
import DetailIndexer from './DetailIndexer'
import "./ViewPage.css"

export interface ReceivedProps {
  person: Person
  filter: Filter
  onSave: (person: Person) => void
  onClose: () => void
}

const baseImage = "https://peekaboo.blob.core.windows.net/faces/"

interface ComponentState { 
  edited: boolean,
  photoIndex: number,
  firstName: string,
  lastName: string,
  nickName: string,
  maidenName: string,
  alternateName: string,
  description: string
}

class EditPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    edited: false,
    photoIndex: 0,
    firstName: "",
    lastName: "",
    nickName: "",
    maidenName: "",
    alternateName: "",
    description: ""
  }

  componentDidMount() {
    this.updateAppState(this.props.person)
}
  componentDidUpdate() {

    if (this.state.edited === false && 
      (this.state.firstName !== this.props.person.firstName ||
        this.state.lastName !== this.props.person.lastName ||
        this.state.nickName !== this.props.person.nickName ||
        this.state.maidenName !== this.props.person.maidenName ||
        this.state.alternateName !== this.props.person.alternateName ||
        this.state.description !== this.props.person.description
       )) {  
        this.updateAppState(this.props.person)
    }
  }

  updateAppState(person: Person) {
    this.setState({
        firstName: person.firstName,
        lastName: person.lastName,
        nickName: person.nickName,
        maidenName: person.maidenName,
        alternateName: person.alternateName,
        description: person.description,
    })
  }

  @OF.autobind
  onFirstNameChanged(text: string) {
      this.setState({firstName: text, edited: true})
  }

  @OF.autobind
  onLastNameChanged(text: string) {
      this.setState({lastName: text, edited: true})
  }

  @OF.autobind
  onNickNameChanged(text: string) {
      this.setState({nickName: text, edited: true})
  }

  @OF.autobind
  onMaidenNameChanged(text: string) {
      this.setState({maidenName: text, edited: true})
  }

  @OF.autobind
  onAlternativeNameChanged(text: string) {
      this.setState({alternateName: text, edited: true})
  }

  @OF.autobind
  onDescriptionNameChanged(text: string) {
      this.setState({description: text, edited: true})
  }
  
  @OF.autobind
  onNextPhoto(): void {
    let photoIndex = this.state.photoIndex + 1
    if (photoIndex >= this.props.person.photoFilenames.length) {
      photoIndex = 0
    }
    this.setState({photoIndex})
  }

  @OF.autobind
  onPrevPhoto(): void {
      let photoIndex = this.state.photoIndex - 1
      if (photoIndex <= 0) {
        photoIndex = this.props.person.photoFilenames.length - 1
      }
      this.setState({photoIndex})
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
    this.props.onSave(newPerson)
  }

  @OF.autobind
  onClickCancel(): void {
    this.props.onClose()
  }

  public render() {
    const imageFile = baseImage + this.props.person.photoFilenames[this.state.photoIndex]
      return (
        <div className="QuizPage">
          <div className="ViewBodyTop">
            <OF.TextField
              label="First Name"
              onChanged={text => this.onFirstNameChanged(text)}
              value={this.state.firstName}
            />
            <OF.TextField
              label="Last Name"
              onChanged={text => this.onLastNameChanged(text)}
              value={this.state.lastName}
            />
            <OF.TextField
              label="Nickname"
              onChanged={text => this.onNickNameChanged(text)}
              value={this.state.nickName}
            />    
            <OF.TextField
              label="Maiden Name"
              onChanged={text => this.onMaidenNameChanged(text)}
              value={this.state.maidenName}
            />
            <OF.TextField
              label="Alternate Name"
              onChanged={text => this.onAlternativeNameChanged(text)}
              value={this.state.alternateName}
            />
            <OF.TextField
              multiline={true}
              rows={4}
              label="Description"
              onChanged={text => this.onDescriptionNameChanged(text)}
              value={this.state.description}
            />

            <DetailTags 
              tags={this.props.person.tags}
              filter={this.props.filter}
            />

            <div className="ViewImageColumn">
              <OF.Image
                className="QuizImageHolder"
                src={imageFile}
                width={160}
                height={160}
              />
              <DetailIndexer
                onPrev={this.onPrevPhoto}
                onNext={this.onNextPhoto}
                currentIndex={this.state.photoIndex}
                total={this.props.person.photoFilenames.length}
              />
            </div>
          </div>
          <div
            className="ViewFooter">
            <OF.IconButton
                className="ImageButton"
                onClick={this.onClickSave}
                iconProps={{ iconName: 'Save' }}
            />
            <OF.IconButton
                className="ImageButton"
                onClick={this.onClickCancel}
                iconProps={{ iconName: 'Cancel' }}
            />
          </div>
      </div>
    );
  }
}

export default EditPage;
