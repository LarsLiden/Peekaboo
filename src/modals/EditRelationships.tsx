/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { generateGUID } from '../Util'
import { Person } from '../models/person'
import { Tag } from '../models/models'
import Search from '../modals/Search'
import { Relationship, RType, RelationshipType } from '../models/relationship'
import { autobind } from 'core-decorators'

export interface ReceivedProps {
  allPeople: Person[]
  allTags: Tag[]
  person: Person
  onSave: (relationships: Relationship[]) => void
  onCancel: () => void
}

interface ComponentState {
  relationships: Relationship[]
  types: { key: string; text: any; }[]
  searchRelationship: Relationship | null
}

function getTypes(): { key: string; text: any; }[] {
  let types = Object.keys(RType).map(e => {
    return {key: RType[e], text: RType[e]}
  })
  types = types.sort((a, b) => {
    if (a.key < b.key) { return -1 }
    else if (b.key < a.key) { return 1 }
    else { return 0 }
    })
  return types
  }

class EditRelationships extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    relationships: [],
    types: getTypes(),
    searchRelationship: null
  }

  componentDidMount() {
    if (this.state.relationships.length === 0) {
      // Make a local copy 
      this.setState({
        relationships: [...this.props.person.relationships]
      })   
    }
  }

  // --- Search ---
  @autobind
  onCloseSearch(): void {
    this.setState({searchRelationship: null})
  }

  @autobind
  onSelectSearch(person:  Person): void {

    if (this.state.searchRelationship) {
      let newRelationship = {...this.state.searchRelationship, personId: person.personId!}

      let index = this.state.relationships.indexOf(this.state.searchRelationship)
      let relationships = [...this.state.relationships]
      relationships[index] = newRelationship
      this.setState({relationships})

      this.setState({
        relationships,
        searchRelationship: null
      })
    }
  }

  @autobind 
  onTypeChange(option: OF.IDropdownOption, relationship: Relationship) {
    let type = RelationshipType.getRelationshipType(option.text)

    let newRelationship = {...relationship!, type}

    let index = this.state.relationships.indexOf(relationship)
    let relationships = [...this.state.relationships]
    relationships[index] = newRelationship
    this.setState({relationships})
  }

  @autobind
  onClickSearch(relationship: Relationship): void {
    this.setState({searchRelationship: relationship})
  }
  
  @autobind
  onClickDelete(relationship: Relationship) {
    this.setState({
      relationships: this.state.relationships.filter(r => r.relationshipId !== relationship.relationshipId)
    }) 
  }

  @autobind
  onClickSave() {
    this.props.onSave(this.state.relationships)
  }

  @autobind
  onClickAdd() {
    const newRelationship: Relationship = {
      relationshipId: generateGUID(),
      type: RelationshipType.getRelationshipType(RType.BOSS_OF),
      personId: "none"
    }
    this.setState({
      relationships: [newRelationship, ...this.state.relationships]
    }) 
  }

  @autobind
  onRenderCell(relationship: Relationship, index: number, isScrolling: boolean): JSX.Element {
    const person = this.props.allPeople.find(p => p.personId === relationship.personId)
    const name = person ? person.fullName() : "--"
    return (
      <div className="SectionBorder">
        <div className='EditRelationshipSection'>
          <div>
            <OF.Dropdown
              key={relationship.relationshipId}
              className="EditDropdown"
              defaultSelectedKey={relationship.type.from}
              options={this.state.types}
              onChanged={(obj) => this.onTypeChange(obj, relationship)}
            />
            <OF.IconButton
              className="ButtonIcon ButtonDark FloatRight"
              onClick={() => this.onClickDelete(relationship)}
              iconProps={{ iconName: 'Delete' }}
            />
          </div>
          <div>
            <OF.Label className="EditRelationshipLabel">
              {name}
            </OF.Label>
            <OF.IconButton
                className="ButtonIcon ButtonDark EditRelationshipSearchButton"
                onClick={() => this.onClickSearch(relationship)}
                iconProps={{ iconName: 'Search' }}
            />
          </div>
        </div>
      </div>
    );
  }

  public render() {
  
    if (this.state.searchRelationship) {
      return (
      <Search
        allPeople={this.props.allPeople}
        allTags={this.props.allTags}
        exclude={this.props.person}
        onCancel={this.onCloseSearch}
        onSelect={this.onSelectSearch}
        onClickSearchFilter={null} 
      />
      )
    }
    
    return (
      <div className="ModalPage">
        <div className="HeaderHolder">
          <div className="HeaderContent">
            <OF.IconButton
                className="ButtonIcon ButtonPrimary ButtonTopLeft"
                onClick={this.onClickAdd}
                iconProps={{ iconName: 'CircleAddition' }}
            />
            Relationships
          </div>
        </div>
        <div className="ModalBodyHolder">
          <div className="ModalBodyContent">
            <OF.List
              items={this.state.relationships}
              onRenderCell={this.onRenderCell}
            />
          </div>
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
                onClick={this.props.onCancel}
                iconProps={{ iconName: 'ChromeClose' }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default EditRelationships;
