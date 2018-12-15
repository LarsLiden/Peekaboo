/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import '../fabric.css'
import { Person } from '../models/person'
import { Relationship, RelationshipType } from '../models/relationship'
import { Filter, Tag, User, KeyValue, Event, SocialNet } from '../models/models'
import CropPage from './CropPage'
import { HEAD_IMAGE, baseBlob, getPhotoBlobName, PHOTO_HEIGHT, PHOTO_WIDTH } from '../Util'
import DetailTags from '../Detail/DetailTags'
import DetailText from '../Detail/DetailText'
import ReactCrop from 'react-image-crop'
import ConfirmModal from '../modals/Confirm'
import EditBasicInfo from '../modals/EditBasicInfo'
import EditTags from '../modals/EditTags'
import EditRelationships from '../modals/EditRelationships'
import EditEvents from '../modals/EditEvents'
import EditKeyValues from '../modals/EditKeyValues'
import EditSocialNetworks from '../modals/EditSocialNetworks'
import DetailIndexer from '../Detail/DetailIndexer'
import DetailRelationships from '../Detail/DetailRelationships'
import DetailEvents from '../Detail/DetailEvents'
import DetailKeyValues from '../Detail/DetailKeyValues'
import DetailSocialNetworks from '../Detail/DetailSocialNetworks'
import { FilePicker } from 'react-file-picker'
import "./ViewPage.css"

export interface ReceivedProps {
  person: Person
  user: User
  filter: Filter
  allTags: Tag[]
  allPeople: Person[]
  subpage: string | null
  onSetSubpage: (subpage: string | null) => void
  onSavePhoto: (person: Person, photoData: string) => void
  onSavePerson: (person: Person) => void
  onDeletePhoto: (person: Person, photoName: string) => void
  onDeletePerson: (person: Person) => void
  onArchivePerson: (person: Person) => void
  onClose: (person?: Person) => void
  onSelectPerson: (personId: string) => void
  onAddTag: (tagName: string) => void
}

export enum SubPage {
  BASIC = "BASIC",
  TAGS = "TAGS",
  RELATIONSHIPS = "RELATIONSHIPS",
  EVENTS = "EVENTS",
  KEYVALUES = "KEYVALUES",
  SOCIALNETWORKS = "SOCIALNETWORKS"
} 

interface ComponentState { 
  edited: boolean
  photoIndex: number
  showCropPage: boolean
  imageURL: string | null
  crop: ReactCrop.Crop
  file: File | null
  isConfirmDeletePhotoOpen: boolean
  isConfirmDeleteOpen: boolean,
  isConfirmArchiveOpen: boolean
}

class EditPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    edited: false,
    photoIndex: 0,
    showCropPage: false,
    imageURL: null,
    crop: {aspect: 1 / 1, x: 0, y: 0, width: 50, height: 50},
    file: null,
    isConfirmDeletePhotoOpen: false,
    isConfirmDeleteOpen: false,
    isConfirmArchiveOpen: false
  }

  // --- EDIT Strings ---
  @OF.autobind
  onSaveEditStrings(person: Person): void {
    this.props.onSavePerson(person)
    this.props.onSetSubpage(null)
  }

  // --- EDIT TAGS ---
  @OF.autobind
  onSaveEditTags(tags: string[]): void {

    let newPerson = new Person({...this.props.person})
    newPerson.tags = tags
    this.props.onSavePerson(newPerson)

    this.props.onSetSubpage(null)
  }

  // --- EDIT REPLATIONSHIPS ---
  @OF.autobind
  onSaveEditRelationships(relationships: Relationship[]): void {
    this.saveReverseRelationships(relationships)
    let newPerson = new Person({...this.props.person})
    newPerson.relationships = relationships
    this.props.onSavePerson(newPerson)
    this.props.onSetSubpage(null)
  }

  getReversePerson(updatedPeople: Person[], relationship: Relationship): Person | null {
    // First see if I have person already
    let person = updatedPeople.find(up => up.personId === relationship.personId)
    if (person) {
      return person
    }
    // If not get them
    person = this.props.allPeople.find(ap => ap.personId === relationship.personId)
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
      r.personId === person.personId && r.type.from === relationship.type.to)
  }

  makeReverseRelationship(relationship: Relationship, personId: string): Relationship {
    return {
      relationshipId: relationship.relationshipId,
      personId,
      type: RelationshipType.getRelationshipType(relationship.type.to)
    }
  }

  saveReverseRelationships(relationships: Relationship[]) {

    // Identify changes
    let removed = this.props.person.relationships.filter(or => !relationships.find(er => er.relationshipId === or.relationshipId))
    let added = relationships.filter(or => !this.props.person.relationships.find(er => er.relationshipId === or.relationshipId))
    let changed = relationships.filter(or => {
      let found = this.props.person.relationships.find(er => er.relationshipId === or.relationshipId)
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
          r.personId !== this.props.person.personId || r.type.from !== removeRelationship.type.from)
      }
    })

    // Additions
    added.forEach(addedRelationship => {
      let reversePerson = this.getReversePerson(updatedPeople, addedRelationship)
      if (reversePerson) {
        // Create and add reverse relationship
        let reverseRelationship = this.makeReverseRelationship(addedRelationship, this.props.person.personId!)
        reversePerson.relationships.push(reverseRelationship)
      }
    })

    // Changes
    changed.forEach(changedRelationship => {
      let reversePerson = this.getReversePerson(updatedPeople, changedRelationship)
      if (reversePerson) {
        // Remove the existing relationship
        reversePerson.relationships = reversePerson.relationships.filter(r => r.relationshipId !== changedRelationship.relationshipId)

        // Create and add reverse new relationship
        let reverseRelationship = this.makeReverseRelationship(changedRelationship, this.props.person.personId!)
        reversePerson.relationships.push(reverseRelationship)
      }
    })

    // Now save changes
    updatedPeople.forEach(person => this.props.onSavePerson(person))
  }

  // --- EDIT Events ---
  @OF.autobind
  onSaveEditEvents(events: Event[]): void {
    let newPerson = new Person({...this.props.person})
    newPerson.events = events
    this.props.onSavePerson(newPerson)
    this.props.onSetSubpage(null)
  }

  // --- EDIT KeyValues ---
  @OF.autobind
  onSaveEditKeyValues(keyValues: KeyValue[]): void {
    let newPerson = new Person({...this.props.person})
    newPerson.keyValues = keyValues
    this.props.onSavePerson(newPerson)
    this.props.onSetSubpage(null)
  }

  // --- EDIT SocialNetworks ---

  @OF.autobind
  onSaveEditSocialNetworks(socialNets: SocialNet[]): void {
    let newPerson = new Person({...this.props.person})
    newPerson.socialNets = socialNets
    this.props.onSavePerson(newPerson)
    this.props.onSetSubpage(null)
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
    let photoName = this.props.person.photoFilenames[this.state.photoIndex]
    this.props.onDeletePhoto(this.props.person, photoName)
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
    this.props.onDeletePerson(this.props.person)
  }

   // --- ARCHIVE PERSON ---
   @OF.autobind
   onCancelArchive(): void {
     this.setState({isConfirmArchiveOpen: false})
   }
 
   @OF.autobind
   onClickArchive(): void {
     this.setState({isConfirmArchiveOpen: true})
   }
 
   @OF.autobind
   onConfirmArchive(): void {
     this.setState({isConfirmArchiveOpen: false})
     this.props.onArchivePerson(this.props.person)
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
  onClickClose(): void {
    this.props.onClose()
  }

  @OF.autobind
  async onSaveCrop(imageData: string): Promise<void> {
    await this.props.onSavePhoto(this.props.person, imageData)
    this.setState({
      imageURL: null,
      photoIndex: this.props.person.photoFilenames.length - 1
    })
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

    // If a brand new person
    if (!this.props.person.firstName || !this.props.person.lastName) {
      return (
        <div>
          <EditBasicInfo
            person={this.props.person}
            onCancel={this.onClickClose}
            onSave={this.onSaveEditStrings}
          />
        </div>
      )
    }

    let photoBlobName = HEAD_IMAGE
    if (this.props.person.photoFilenames.length > 0) {
      photoBlobName = baseBlob(this.props.user) 
        + getPhotoBlobName(this.props.person, this.props.person.photoFilenames[this.state.photoIndex])
    }
    let width = 160
    let height = (PHOTO_HEIGHT / PHOTO_WIDTH) * width

    if (this.state.imageURL) {
      return (
        <CropPage
          imageURL={this.state.imageURL}
          onClose={this.onCloseCropper}
          onSave={(imageData) => this.onSaveCrop(imageData)}
        />
      )
    }
    else if (this.props.subpage === SubPage.BASIC) {
      return (
        <EditBasicInfo
          person={this.props.person}
          onCancel={() => this.props.onSetSubpage(null)}
          onSave={this.onSaveEditStrings}
        />
      )
    }
    else if (this.props.subpage === SubPage.TAGS) {
      return (
        <EditTags
          allTags={this.props.allTags}
          personTags={this.props.person.tags}
          onCancel={() => this.props.onSetSubpage(null)}
          onSave={this.onSaveEditTags}
          onAddTag={this.props.onAddTag}
        />
      )
    }
    else if (this.props.subpage === SubPage.RELATIONSHIPS) {
      return (
        <EditRelationships
          allPeople={this.props.allPeople}
          person={this.props.person}
          onCancel={() => this.props.onSetSubpage(null)}
          onSave={this.onSaveEditRelationships}
        />
      )
    }
    else if (this.props.subpage === SubPage.EVENTS) {
      return (
        <EditEvents
          person={this.props.person}
          onCancel={() => this.props.onSetSubpage(null)}
          onSave={this.onSaveEditEvents}
        />
      )
    }
    else if (this.props.subpage === SubPage.KEYVALUES) {
      return (
        <EditKeyValues
          person={this.props.person}
          onCancel={() => this.props.onSetSubpage(null)}
          onSave={this.onSaveEditKeyValues}
        />
      )
    }
    else if (this.props.subpage === SubPage.SOCIALNETWORKS) {
      return (
        <EditSocialNetworks
          person={this.props.person}
          onCancel={() => this.props.onSetSubpage(null)}
          onSave={this.onSaveEditSocialNetworks}
        />
      )
    }
    else if (this.state.isConfirmDeleteOpen) {
      return (
        <ConfirmModal
          title="Are you sure you want to delete"
          subtitle={this.props.person.fullName()}
          onCancel={this.onCancelDelete}
          onConfirm={this.onConfirmDelete}
        />
      )
    }
    else if (this.state.isConfirmArchiveOpen) {
      return (
        <ConfirmModal
          title="Are you sure you want to archive"
          subtitle={this.props.person.fullName()}
          onCancel={this.onCancelArchive}
          onConfirm={this.onConfirmArchive}
        />
      )
    }
    else if (this.state.isConfirmDeletePhotoOpen) {
      return (
        <ConfirmModal
          title="Are you sure you want to delete this photo?"
          onCancel={this.onCancelDeletePhoto}
          onConfirm={this.onConfirmDeletePhoto}
        />
      )
    }

    return (
      <div className="ModalPage">
        <div className="HeaderHolder HeaderHolderTall">
          <div className="HeaderContent HeaderNoPadding">
            <div className="EditImageColumn">
              <FilePicker
                extensions={['png', 'jpeg', 'jpg']}
                onChange={this.onChangeFile}
                //TODO onError={(error: string) => this.props.setErrorDisplay(ErrorType.Error, error, [], null)}
                maxSize={10}
              >
                <div>
                    <OF.IconButton
                      className="ButtonIcon ButtonDark ButtonTopFlush"
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
              src={photoBlobName}
              width={width}
              height={height}
            />
            <div className="InlineBlock">
              <DetailIndexer
                isVertical={true}
                onPrev={this.onPrevPhoto}
                onNext={this.onNextPhoto}
                currentIndex={this.state.photoIndex}
                total={this.props.person.photoFilenames.length}
              />
            </div>
          </div>
        </div>

        <div className="ModalBodyHolder">
          <div className="ModalBodyContent ModalBodyHeaderHolderTall">
            <div className="EditPageSection">
              <DetailText title="First Name" text={this.props.person.firstName} showEmpty={true} isLong={true}/>                
              <OF.IconButton
                className="ButtonIcon ButtonDark EditPageButton"
                onClick={() => this.props.onSetSubpage(SubPage.BASIC)}
                iconProps={{ iconName: 'Edit' }}
              />
            </div>
            <div className="EditPageSection">
              <DetailText title="Last Name" text={this.props.person.lastName} showEmpty={true} isLong={true}/>
              <OF.IconButton
                  className="ButtonIcon ButtonDark EditPageButton"
                  onClick={() => this.props.onSetSubpage(SubPage.BASIC)}
                  iconProps={{ iconName: 'Edit' }}
              />
            </div>  
            <div className="EditPageSection">
              <DetailText title="Nickname" text={this.props.person.nickName} showEmpty={true} isLong={true}/>
              <OF.IconButton
                  className="ButtonIcon ButtonDark EditPageButton"
                  onClick={() => this.props.onSetSubpage(SubPage.BASIC)}
                  iconProps={{ iconName: 'Edit' }}
              />
            </div>
            <div className="EditPageSection">
              <DetailText title="Alt Name" text={this.props.person.alternateName} showEmpty={true} isLong={true}/>
              <OF.IconButton
                  className="ButtonIcon ButtonDark EditPageButton"
                  onClick={() => this.props.onSetSubpage(SubPage.BASIC)}
                  iconProps={{ iconName: 'Edit' }}
              />
            </div>
            <div className="EditPageSection">
              <DetailText title="Maiden Name" text={this.props.person.maidenName} showEmpty={true} isLong={true}/>
              <OF.IconButton
                  className="ButtonIcon ButtonDark EditPageButton"
                  onClick={() => this.props.onSetSubpage(SubPage.BASIC)}
                  iconProps={{ iconName: 'Edit' }}
              />
            </div>
            <div className="EditPageSection">
              <DetailText title="Description" text={this.props.person.description} showEmpty={true} isLong={true}/> 
              <OF.IconButton
                  className="ButtonIcon ButtonDark EditPageButton"
                  onClick={() => this.props.onSetSubpage(SubPage.BASIC)}
                  iconProps={{ iconName: 'Edit' }}
              />
            </div>
            <div className="EditPageSection">
              <DetailTags 
                inEdit={true}
                tags={this.props.person.tags}
                filter={this.props.filter}
              />
              <OF.IconButton
                  className="ButtonIcon ButtonDark EditPageButton"
                  onClick={() => this.props.onSetSubpage(SubPage.TAGS)}
                  iconProps={{ iconName: 'Edit' }}
              />
            </div>
            <div className="EditPageSection">
              <DetailRelationships
                inEdit={true}
                relationships={this.props.person.relationships}
                allPeople={this.props.allPeople}
                onSelectPerson={this.props.onSelectPerson}
              />
              <OF.IconButton
                  className="ButtonIcon ButtonDark EditPageButton"
                  onClick={() => this.props.onSetSubpage(SubPage.RELATIONSHIPS)}
                  iconProps={{ iconName: 'Edit' }}
              />
            </div>
            <div className="EditPageSection">
              <DetailEvents
                inEdit={true}
                events={this.props.person.events}
              />
              <OF.IconButton
                className="ButtonIcon ButtonDark EditPageButton"
                onClick={() => this.props.onSetSubpage(SubPage.EVENTS)}
                iconProps={{ iconName: 'Edit' }}
              />
            </div>
            <div className="EditPageSection">
              <DetailKeyValues
                inEdit={true}
                keyValues={this.props.person.keyValues}
              />
              <OF.IconButton
                  className="ButtonIcon ButtonDark EditPageButton"
                  onClick={() => this.props.onSetSubpage(SubPage.KEYVALUES)}
                  iconProps={{ iconName: 'Edit' }}
              />
            </div>
            <div className="EditPageSection">
              <DetailSocialNetworks
                inEdit={true}
                socialNets={this.props.person.socialNets}
              />
              <OF.IconButton
                  className="ButtonIcon ButtonDark EditPageButton"
                  onClick={() => this.props.onSetSubpage(SubPage.SOCIALNETWORKS)}
                  iconProps={{ iconName: 'Edit' }}
              />
            </div>
          </div>
        </div>

        <div className="FooterHolder">
          <div className="FooterContent">
            <OF.IconButton
                className="ButtonIcon ButtonPrimary FloatLeft"
                onClick={this.onClickClose}
                iconProps={{ iconName: 'ChromeBack' }}
            />
            {this.props.person.personId &&
              <OF.IconButton
                  className="ButtonIcon ButtonPrimary FloatRight"
                  onClick={this.onClickDelete}
                  iconProps={{ iconName: 'Trash' }}
              />
            }
            {this.props.user.isAdmin &&
              <OF.IconButton
                  className="ButtonIcon ButtonPrimary FloatRight"
                  onClick={this.onClickArchive}
                  iconProps={{ iconName: 'Archive' }}
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default EditPage;
