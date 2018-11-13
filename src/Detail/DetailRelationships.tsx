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
  inEdit?: boolean
}

class DetailRelationships extends React.Component<ReceivedProps, {}> {

  @OF.autobind
  private onRenderCell(relationship: Relationship, index: number, isScrolling: boolean): JSX.Element {

    return (
      <div className="DetailRelationship">{`${relationship.type.from} ${relationship.name}`}</div>
    )
  }

  public render() {
    if (!this.props.inEdit && this.props.relationships.length === 0) {
      return null
    }
      return (
        <div className={`DetailText ${this.props.inEdit ? 'DetailEdit'  : ''}`}>
          <div className={`DetailTitle ${this.props.inEdit ? 'DetailEditTitle'  : ''}`}>
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
