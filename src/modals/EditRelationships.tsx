/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { Person } from '../models/person'
import { Relationship, RType } from '../models/relationship'

export interface ReceivedProps {
  relationships: Relationship[]
  allPeople: Person[]
  onSave: (relationships: Relationship[]) => void
  onCancel: () => void
}

interface ComponentState {
  relationships: Relationship[]
  types: { key: string; text: any; }[]
}

class EditRelationships extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    relationships: [],
    types: Object.keys(RType).map(e => {
      return {key: RType[e], text: RType[e]}
    })
  }

  componentDidMount() {
    if (this.state.relationships.length == 0) {
      // Make a local copy 
      this.setState({
        relationships: [...this.props.relationships]
      })   
    }
  }

  @OF.autobind
  private onClickSave() {
    this.props.onSave(this.state.relationships)
  }

  @OF.autobind
  private onRenderCell(relationship: Relationship, index: number, isScrolling: boolean): JSX.Element {
    const person = this.props.allPeople.find(p => p.guid === relationship.guid)
    const name = person ? person.fullName() : "MISSING PERSON"
    return (
      <div className="FilterLine">
        <div className='EditSection'>
          <OF.Dropdown
            className="EditRelationshipDropdown"
            defaultSelectedKey={relationship.type.from}
            options={this.state.types}
          />
          <OF.Label className="EditRelationshipLabel">
            {name}
          </OF.Label>
          <OF.IconButton
              className="ButtonIcon ButtonDark"
        //LARS      onClick={this.onEditRelationships}
              iconProps={{ iconName: 'Search' }}
          />
        </div>
      </div>
    );
  }

  public render() {
  
    return (
      <div className="ModalPage">
        <div className="ContentHeader FilterHeader">
          Tags
        </div>
        <div className="ModalBody">
          <OF.List
            className="FilterList"
            items={this.state.relationships}
            onRenderCell={this.onRenderCell}
          />
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
              onClick={this.props.onCancel}
              iconProps={{ iconName: 'Cancel' }}
          />
        </div>
      </div>
    );
  }
}

export default EditRelationships;
