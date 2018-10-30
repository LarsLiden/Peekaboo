import * as React from 'react';
import { KeyValue } from './models/models'
import * as OF from 'office-ui-fabric-react'
import "./DetailEvents.css"
import './fabric.css'

export interface ReceivedProps {
  keyValues: KeyValue[]
}

interface ComponentState { 
  inEditMode: boolean
}


const columns: OF.IColumn[] = [
  {
    key: 'key',
    name: 'key',
    fieldName: 'key',
    minWidth: 50,
    maxWidth: 50,
    //onColumnClick: this._onColumnClick,
    onRender: (item: KeyValue) => {
      return <div className="TableCell">{item.key}</div>
    }
  },
  {
    key: 'value',
    name: 'value',
    fieldName: 'value',
    minWidth: 200,
    maxWidth: 200,
    isMultiline: true,
    //onColumnClick: this._onColumnClick,
    onRender: (item: KeyValue) => {
      return <div className="TableCell">{item.value}</div>
    }
  }
]

class DetailKeyValues extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    inEditMode: false
  }

  public render() {

      return (
        <div className="DetailText">
          <div className="DetailTitle">
            INFO
          </div>
          <div className="DetailLongBody">
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
