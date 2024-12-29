/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import { KeyValue } from '../models/models'
import * as OF from 'office-ui-fabric-react'
import "./DetailEvents.css"
import '../fabric.css'

export interface ReceivedProps {
  keyValues: KeyValue[]
  inEdit?: boolean;
}

const columns: OF.IColumn[] = [
  {
    key: 'key',
    name: 'key',
    fieldName: 'key',
    minWidth: 80,
    maxWidth: 80,
    //onColumnClick: this._onColumnClick,
    onRender: (item: KeyValue) => {
      return <div className="TableCell">{item.key}</div>
    }
  },
  {
    key: 'value',
    name: 'value',
    fieldName: 'value',
    minWidth: 150,
    maxWidth: 150,
    isMultiline: true,
    //onColumnClick: this._onColumnClick,
    onRender: (item: KeyValue) => {
      return <div className="TableCell">{item.value}</div>
    }
  }
]

class DetailKeyValues extends React.Component<ReceivedProps, {}> {

  public render() {
    if (!this.props.inEdit && this.props.keyValues.length === 0) {
      return null
    }
      return (
        <div className={`DetailText ${this.props.inEdit ? 'DetailEdit'  : ''}`}>
          <div className={`DetailTitle`}>
            Key Values
          </div>
          <div className="DetailBody DetailLongBody">
            <OF.DetailsList
                isHeaderVisible={false}
                compact={true}
                selectionMode={OF.SelectionMode.none}
                className="DetailEventList"
                columns={columns}
                items={this.props.keyValues}
            />
          </div>
        </div>
    )
  }
}

export default DetailKeyValues;
