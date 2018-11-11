/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import { Relationship } from '../models/relationship'
import * as OF from 'office-ui-fabric-react'
import '../fabric.css'

export interface ReceivedProps {
  relationships: Relationship[]
}

interface ComponentState { 
  inEditMode: boolean
}

class DetailRelationships extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    inEditMode: false
  }

  @OF.autobind
  private onRenderCell(relationship: Relationship, index: number, isScrolling: boolean): JSX.Element {

    return (
      <div className="DetailRelationship">{`${relationship.type.from} ${relationship.name}`}</div>
    )
  }

  public render() {
    if (this.props.relationships.length === 0) {
      return null
    }
      return (
        <div className="DetailText">
          <div className="DetailTitle">
            Relationships
          </div>
          <div className="DetailLongBody">
            <OF.List
                className="DetailRelationshipList"
                items={this.props.relationships}
                onRenderCell={this.onRenderCell}
            />
          </div>
        </div>
    )
  }
}

export default DetailRelationships;
