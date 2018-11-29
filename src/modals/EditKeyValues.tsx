/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import DetailEditText from '../Detail/DetailEditText'
import { Person } from '../models/person'
import { KeyValue } from '../models/models'

export interface ReceivedProps {
  person: Person
  onSave: (keyValues: KeyValue[]) => void
  onCancel: () => void
}

interface ComponentState {
  keyValues: KeyValue[]
}

class EditKeyValues extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    keyValues: []
  }

  componentDidMount() {
    if (this.state.keyValues.length === 0) {
      // Make a local copy 
      this.setState({
        keyValues: [...this.props.person.keyValues]
      })   
    }
  }

  @OF.autobind
  onClickDelete(keyValue: KeyValue) {
    this.setState({
      keyValues: this.state.keyValues.filter(k => k.key !== keyValue.key)
    }) 
  }

  @OF.autobind
  onClickSave() {
    this.props.onSave(this.state.keyValues)
  }

  @OF.autobind
  onClickAdd() {
    const newKeyValue: KeyValue = {
      key: "",
      value: ""
    }
    this.setState({
      keyValues: [...this.state.keyValues, newKeyValue]
    }) 
  }

  @OF.autobind
  onKeyChanged(key: string, keyValue: KeyValue) {
    let changed = this.state.keyValues.find(kv => kv.key === keyValue.key)
    changed!.key = key
  }

  @OF.autobind
  onValueChanged(value: string, keyValue: KeyValue) {
    let changed = this.state.keyValues.find(kv => kv.key === keyValue.key)
    changed!.value = value
  }

  @OF.autobind
  onRenderCell(keyValue: KeyValue, index: number, isScrolling: boolean): JSX.Element {
    return (
      <div className="FilterLine">
        <div className='EditSection EditKeyValueSection'>
          <div className="DetailText DetailEditKeyValue">
            <DetailEditText
              label="Key"
              onChanged={key => this.onKeyChanged(key, keyValue)}
              value={keyValue.key}
            />
            <DetailEditText
              label="Value"
              onChanged={value => this.onValueChanged(value, keyValue)}
              value={keyValue.value}
            />
          </div>
          <OF.IconButton
            className="ButtonIcon ButtonDark FloatRight"
            onClick={() => this.onClickDelete(keyValue)}
            iconProps={{ iconName: 'Delete' }}
        />
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
          Key Values
        </div>
        <div className="ModalBody">
          <OF.List
            className="FilterList"
            items={this.state.keyValues}
            onRenderCell={this.onRenderCell}
          />
        </div>
        <div
          className="ContentFooter"
        >
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
    );
  }
}

export default EditKeyValues;
