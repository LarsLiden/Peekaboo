/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import '../fabric.css'
import { Person } from '../models/person'
import { Relationship, RelationshipType } from '../models/relationship'
import { Filter, Tag } from '../models/models'
import CropPage from './CropPage'
import DetailTags from '../Detail/DetailTags'
import ReactCrop from 'react-image-crop'
import ConfirmModal from '../modals/Confirm'
import EditTags from '../modals/EditTags'
import EditRelationships from '../modals/EditRelationships'
import DetailIndexer from '../Detail/DetailIndexer'
import DetailRelationships from '../Detail/DetailRelationships'
import DetailEvents from '../Detail/DetailEvents'
import DetailKeyValues from '../Detail/DetailKeyValues'
import DetailSocialNetworks from '../Detail/DetailSocialNetworks'
import DetailEditText from '../Detail/DetailEditText'
import { FilePicker } from 'react-file-picker'
import "./ViewPage.css"

export interface ReceivedProps {
  person: Person
  filter: Filter
  allTags: Tag[]
  allPeople: Person[]
  onSaveImage: (person: Person, blob: Blob) => void
  onSavePerson: (person: Person) => void
  onClose: (person?: Person) => void
}

const baseImage = "https://peekaboo.blob.core.windows.net/faces/"

interface ComponentState { 
  edited: boolean
  photoIndex: number
  firstName: string
  lastName: string
  nickName: string
  maidenName: string
  alternateName: string
  description: string
  tags: string[]
  relationships: Relationship[]
  showCropPage: boolean
  imageURL: string | null
  crop: ReactCrop.Crop
  file: File | null
  isEditTagsOpen: boolean
  isEditRelationshipsOpen: boolean
  isConfirmDeletePhotoOpen: boolean
  isConfirmDeleteOpen: boolean
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
    description: "",
    tags: [],
    relationships: [],
    showCropPage: false,
    imageURL: null,
    crop: {aspect: 1/1, x:0, y:0, width: 50, height: 50},
    file: null,
    isEditTagsOpen: false,
    isEditRelationshipsOpen: false,
    isConfirmDeletePhotoOpen: false,
    isConfirmDeleteOpen: false
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
        this.state.description !== this.props.person.description ||
        this.state.tags !== this.props.person.tags ||
        this.state.relationships !== this.props.person.relationships
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
        tags: person.tags,
        relationships: person.relationships
    })
  }

  // --- EDIT TAGS ---
  @OF.autobind
  onCancelEditTags(): void {
    this.setState({isEditTagsOpen: false})
  }

  @OF.autobind
  onSaveEditTags(tagNames: string[]): void {
    this.setState({
      isEditTagsOpen: false,
      tags: tagNames,
      edited: true
    })
  }

  @OF.autobind
  onEditTags(): void {
    this.setState({isEditTagsOpen: true})
  }

  // --- EDIT REPLATIONSHIPS ---
  @OF.autobind
  onCancelEditRelationships(): void {
    this.setState({isEditRelationshipsOpen: false})
  }

  @OF.autobind
  onSaveEditRelationships(relationships: Relationship[]): void {
    this.setState({
      isEditRelationshipsOpen: false,
      relationships,
      edited: true
    })
  }

  @OF.autobind
  onEditRelationships(): void {
    this.setState({isEditRelationshipsOpen: true})
  }

  getReversePerson(updatedPeople: Person[], relationship: Relationship): Person | null {
    // First see if I have person already
    let person = updatedPeople.find(up => up.guid === relationship.guid)
    if (person) {
      return person
    }
    // If not get them
    person = this.props.allPeople.find(ap => ap.guid === relationship.guid)
    if (person) {
      let copy = new Person(person)
      updatedPeople.push(copy)
      return copy
    }
    console.log("MisSING PERSON")
    return null
  }

  findRelationship(person: Person, relationship: Relationship): Relationship | undefined {
    return person.relationships.find(r => 
      r.guid === person.guid && r.type.from === relationship.type.to)
  }

  makeReverseRelationship(relationship: Relationship, guid: string): Relationship {
    let reverse: Relationship =  {
      guid,
      type: RelationshipType.getRelationshipType(relationship.type.to)
    }
    return reverse
  }

  saveReverseRelationships() {
    // TODO - issue when more then one relationship type with a person.  Need id's to identify
    
    // Identify changes
    let removed = this.props.person.relationships.filter(or => !this.state.relationships.find(er => er.guid === or.guid))
    let added = this.state.relationships.filter(or => !this.props.person.relationships.find(er => er.guid === or.guid))
    let changed = this.state.relationships.filter(or => {
      let found = this.props.person.relationships.find(er => er.guid === or.guid)
      return (found && found.type !== or.type)
    })

    // Update the reverse people
    let updatedPeople: Person[] = []

    // Removals
    removed.forEach(removeRelationship => {
      let reversePerson = this.getReversePerson(updatedPeople, removeRelationship)
      if (reversePerson) {
        // Remove the relationship
        reversePerson.relationships = reversePerson.relationships.filter(r => 
          r.guid !== this.props.person.guid || r.type.from !== removeRelationship.type.from)
      }
    })

    // Additions
    added.forEach(addedRelationship => {
      let reversePerson = this.getReversePerson(updatedPeople, addedRelationship)
      if (reversePerson) {
        // Create and add reverse relationship
        let reverseRelationship = this.makeReverseRelationship(addedRelationship, this.props.person.guid)
        reversePerson.relationships.push(reverseRelationship)
      }
    })

    // Changes
    changed.forEach(changedRelationship => {
      let reversePerson = this.getReversePerson(updatedPeople, changedRelationship)
      if (reversePerson) {
        // Remove the existing relationship
        reversePerson.relationships = reversePerson.relationships.filter(r => r.guid !== this.props.person.guid)

        // Create and add reverse new relationship
        let reverseRelationship = this.makeReverseRelationship(changedRelationship, this.props.person.guid)
        reversePerson.relationships.push(reverseRelationship)
      }
    })

    // Now save changes
    updatedPeople.forEach(person => this.props.onSavePerson(person))
  }

  // --- DELETE PHOTO ---
  @OF.autobind
  onDeletePhoto(): void {
    this.setState({isConfirmDeletePhotoOpen: true})
  }

  @OF.autobind
  onCancelDeletePhoto(): void {
    this.setState({isConfirmDeletePhotoOpen: false})
  }

  @OF.autobind
  onConfirmDeletePhoto(): void {
    //TODO - delete
    this.setState({isConfirmDeletePhotoOpen: false})
  }

  // --- DELETE PERSON ---
  @OF.autobind
  onCancelDelete(): void {
    this.setState({isConfirmDeleteOpen: false})
  }

  @OF.autobind
  onClickDelete(): void {
    this.setState({isConfirmDeleteOpen: true})
  }

  @OF.autobind
  onConfirmDelete(): void {
    this.setState({isConfirmDeleteOpen: false})
  }

  @OF.autobind
  onFirstNameChanged(text: string) {
    //TODO - delete
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

    this.saveReverseRelationships()

    let newPerson = new Person({...this.props.person})
    newPerson.firstName = this.state.firstName
    newPerson.lastName = this.state.lastName
    newPerson.nickName = this.state.nickName
    newPerson.maidenName = this.state.maidenName
    newPerson.alternateName = this.state.alternateName
    newPerson.description = this.state.description
    newPerson.tags = this.state.tags
    newPerson.relationships = this.state.relationships
    this.props.onClose(newPerson)
  }

  @OF.autobind
  onClickCancel(): void {
    this.props.onClose()
  }

  @OF.autobind
  onSaveCrop(blob: Blob): void {
    this.props.onSaveImage(this.props.person, blob)
    this.setState({imageURL: null})
  }

  @OF.autobind
  onCloseCropper(): void {
    this.setState({imageURL: null})
  }

  @OF.autobind
  onChangeFile(file: File) {
    this.setState({file})

    try {
      const imageURL = URL.createObjectURL(file);
      this.setState({imageURL})
    }
    catch (error) {
      console.log(error)
    }
  }

  @OF.autobind
  onCropChange(crop: ReactCrop.Crop) {
    this.setState({ crop });  
  }

  public render() {
    const imageFile = baseImage + this.props.person.photoFilenames[this.state.photoIndex]
      return (
        <div className="QuizPage">
          {this.state.imageURL &&
            <CropPage
              imageURL={this.state.imageURL}
              onClose={this.onCloseCropper}
              onSave={(blob)=>this.onSaveCrop(blob)}
            />
          }
          {!this.state.imageURL &&
            <div>
              <div className="ContentHeader">
              <div className="EditImageColumn">
                  <FilePicker
                    extensions={['png', 'jpeg', 'jpg']}
                    onChange={this.onChangeFile}
                    //TODO onError={(error: string) => this.props.setErrorDisplay(ErrorType.Error, error, [], null)}
                    maxSize={10}
                  >
                    <div>
                        <OF.IconButton
                          className="ButtonIcon ButtonDark"
                          iconProps={{ iconName: 'CircleAddition' }}
                        />
                    </div>
                  </FilePicker>
                  <div className='EditButtonSpacer'/>
                  <OF.IconButton
                    className="ButtonIcon ButtonDark"
                    onClick={this.onDeletePhoto}
                    iconProps={{ iconName: 'Delete' }}
                  />
                </div>
                <OF.Image
                  className="QuizImageHolder"
                  src={imageFile}
                  width={160}
                  height={160}
                />
                <DetailIndexer
                  isVertical={true}
                  onPrev={this.onPrevPhoto}
                  onNext={this.onNextPhoto}
                  currentIndex={this.state.photoIndex}
                  total={this.props.person.photoFilenames.length}
                />
              </div>
              <div className="ContentBody EditContent">
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
                <div className='EditSection'>
                  <DetailTags 
                    inEdit={true}
                    tags={this.state.tags}
                    filter={this.props.filter}
                  />
                  <OF.IconButton
                      className="ButtonIcon ButtonDark"
                      onClick={this.onEditTags}
                      iconProps={{ iconName: 'Edit' }}
                  />
                </div>
                <div className='EditSection'>
                  <DetailRelationships
                    inEdit={true}
                    relationships={this.state.relationships}
                    allPeople={this.props.allPeople}
                    onSelectPerson={() => {}}  // LARS temp
                  />
                  <OF.IconButton
                      className="ButtonIcon ButtonDark"
                      onClick={this.onEditRelationships}
                      iconProps={{ iconName: 'Edit' }}
                  />
                </div>
                <div className='EditSection'>
                  <DetailEvents
                    inEdit={true}
                    events={this.props.person.events}
                  />
                  <OF.IconButton
                    className="ButtonIcon ButtonDark"
                    // onClick={this.onEditTags}
                    iconProps={{ iconName: 'Edit' }}
                  />
                </div>
                <div className='EditSection'>
                  <DetailKeyValues
                    inEdit={true}
                    keyValues={this.props.person.keyValues}
                  />
                  <OF.IconButton
                      className="ButtonIcon ButtonDark"
                     // onClick={this.onEditTags}
                      iconProps={{ iconName: 'Edit' }}
                  />
                </div>
                <div className='EditSection'>
                  <DetailSocialNetworks
                    inEdit={true}
                    socialNets={this.props.person.socialNets}
                  />
                  <OF.IconButton
                      className="ButtonIcon ButtonDark"
                     // onClick={this.onEditTags}
                      iconProps={{ iconName: 'Edit' }}
                  />
                </div>
              </div>
              <div
                className="ContentFooter">
                <OF.IconButton
                    className="ButtonIcon ButtonPrimary"
                    onClick={this.onClickSave}
                    iconProps={{ iconName: 'Save' }}
                />
                <OF.IconButton
                    className="ButtonIcon ButtonPrimary"
                    onClick={this.onClickCancel}
                    iconProps={{ iconName: 'Cancel' }}
                />
                <OF.IconButton
                    className="ButtonIcon ButtonPrimary"
                    onClick={this.onClickDelete}
                    iconProps={{ iconName: 'Trash' }}
                />
              </div>
            </div>
          }
          {this.state.isEditTagsOpen &&
            <EditTags
              allTags={this.props.allTags}
              personTags={this.state.tags}
              onCancel={this.onCancelEditTags}
              onSave={this.onSaveEditTags}
            >
            </EditTags>
          }
          {this.state.isEditRelationshipsOpen &&
            <EditRelationships
              relationships={this.state.relationships}
              allPeople={this.props.allPeople}
              person={this.props.person}
              onCancel={this.onCancelEditRelationships}
              onSave={this.onSaveEditRelationships}
            >
            </EditRelationships>
          }
          {this.state.isConfirmDeleteOpen &&
            <ConfirmModal
              title="Are you sure you want to delete this person?"
              onCancel={this.onCancelDelete}
              onConfirm={this.onConfirmDelete}
            >
            </ConfirmModal>
          }
          {this.state.isConfirmDeletePhotoOpen &&
            <ConfirmModal
              title="Are you sure you want to delete this photo?"
              onCancel={this.onCancelDeletePhoto}
              onConfirm={this.onConfirmDeletePhoto}
            >
            </ConfirmModal>
          }
      </div>
    );
  }
}

export default EditPage;
