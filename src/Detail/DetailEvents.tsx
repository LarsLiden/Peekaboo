/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import { Event } from '../models/models'
import * as OF from 'office-ui-fabric-react'
import "./DetailEvents.css"
import '../fabric.css'

export interface ReceivedProps {
  events: Event[]
  inEdit?: boolean
}

const columns: OF.IColumn[] = [
  {
    key: 'date',
    name: 'Date',
    fieldName: 'date',
    minWidth: 50,
    maxWidth: 50,
    //onColumnClick: this._onColumnClick,
    onRender: (item: Event) => {
      return <div className="TableCell">{item.date}</div>
    }
  },
  {
    key: 'description',
    name: 'Description',
    fieldName: 'description',
    minWidth: 200,
    maxWidth: 200,
    isMultiline: true,
    //onColumnClick: this._onColumnClick,
    onRender: (item: Event) => {
      return <div className="TableCell">{item.description}</div>
    }
  },
  {
    key: 'location',
    name: 'Location',
    fieldName: 'location',
    minWidth: 10,
    maxWidth: 10,
    //onColumnClick: this._onColumnClick,
    onRender: (item: Event) => {
      return <div className="TableCell">{item.location}</div>
    }
  }
]

class DetailEvents extends React.Component<ReceivedProps, {}> {

  public render() {
      if (!this.props.inEdit && this.props.events.length === 0) {
        return null
      }
      return (
        <div className={`DetailText ${this.props.inEdit ? 'DetailEdit'  : ''}`}>
          <div className={`DetailTitle ${this.props.inEdit ? 'DetailEditTitle'  : ''}`}>
            Events
          </div>
          <div className="DetailLongBody">
            <OF.DetailsList
                isHeaderVisible={false}
                compact={true}
                selectionMode={OF.SelectionMode.none}
                className="DetailEventList"
                columns={columns}
                items={this.props.events}
            />
          </div>
        </div>
    )
  }
}

export default DetailEvents;
