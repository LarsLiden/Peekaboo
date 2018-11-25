/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { generateGUID } from '../Util'
import { Person } from '../models/person'
import Search from '../modals/Search'
import { Relationship, RType, RelationshipType } from '../models/relationship'

export interface ReceivedProps {
  allPeople: Person[]
  person: Person
  onSave: (relationships: Relationship[]) => void
  onCancel: () => void
}

interface ComponentState {
  relationships: Relationship[]
  types: { key: string; text: any; }[]
  searchTarget: Relationship | null
}

class EditRelationships extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    relationships: [],
    types: Object.keys(RType).map(e => {
      return {key: RType[e], text: RType[e]}
    }),
    searchTarget: null
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
  @OF.autobind
  onCloseSearch(): void {
    this.setState({searchTarget: null})
  }

  @OF.autobind
  onSelectSearch(person:  Person): void {

    let relationships = this.state.relationships.filter(r => r !== this.state.searchTarget)
    let changedRelationship: Relationship = {...this.state.searchTarget!, personId: person.guid }
    relationships.push(changedRelationship)

    this.setState({
      relationships,
      searchTarget: null
    })
  }

  @OF.autobind 
  onTypeChange(option: OF.IDropdownOption, relationship: Relationship) {
    let relationships = this.state.relationships.filter(r => r !== relationship)
    let type = RelationshipType.getRelationshipType(option.text)
    let changedRelationship: Relationship = {...relationship, type: type} 
    relationships.push(changedRelationship)

    this.setState({
      relationships
    })
  }

  @OF.autobind
  onClickSearch(relationship: Relationship): void {
    this.setState({searchTarget: relationship})
  }
  
  @OF.autobind
  onClickDelete(relationship: Relationship) {
    this.setState({
      relationships: this.state.relationships.filter(r => r.personId !== relationship.personId)
    }) 
  }

  @OF.autobind
  onClickSave() {
    this.props.onSave(this.state.relationships)
  }

  @OF.autobind
  onClickAdd() {
    const newRelationship: Relationship = {
      id: generateGUID(),
      type: RelationshipType.getRelationshipType(RType.BOSS_OF),
      personId: "none"
    }
    this.setState({
      relationships: [...this.state.relationships, newRelationship]
    }) 
  }

  @OF.autobind
  onRenderCell(relationship: Relationship, index: number, isScrolling: boolean): JSX.Element {
    const person = this.props.allPeople.find(p => p.guid === relationship.personId)
    const name = person ? person.fullName() : "--"
    return (
      <div className="FilterLine">
        <div className='EditSection EditRelationshipSection'>
          <div>
            <OF.Dropdown
              className="EditRelationshipDropdown"
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
                className="ButtonIcon ButtonDark FloatRight"
                onClick={() => this.onClickSearch(relationship)}
                iconProps={{ iconName: 'Search' }}
            />
          </div>
        </div>
      </div>
    );
  }

  public render() {
  
    return (
      <div className="ModalPage">
        <div className="ContentHeader FilterHeader">
          <OF.IconButton
              className="ButtonIcon ButtonPrimary ButtonTopLeft"
              onClick={this.onClickAdd}
              iconProps={{ iconName: 'CircleAddition' }}
          />
          Relationships
        </div>
        <div className="ModalBody">
          <OF.List
            className="FilterList"
            items={this.state.relationships}
            onRenderCell={this.onRenderCell}
          />
        </div>
        <div
          className="ContentFooter"
        >
          <OF.IconButton
              className="ButtonIcon ButtonPrimary"
              onClick={this.onClickSave}
              iconProps={{ iconName: 'Save' }}
          />
          <OF.IconButton
              className="ButtonIcon ButtonPrimary"
              onClick={this.props.onCancel}
              iconProps={{ iconName: 'Cancel' }}
          />
        </div>
        {this.state.searchTarget &&
            <Search
              people={this.props.allPeople}
              exclude={this.props.person}
              onCancel={this.onCloseSearch}
              onSelect={this.onSelectSearch}
            />
        }
      </div>
    );
  }
}

export default EditRelationships;
