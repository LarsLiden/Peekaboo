/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import DetailEditText from '../Detail/DetailEditText'
import { Person } from '../models/person'
import { KeyValue } from '../models/models'
import { generateGUID, isValid, MAX_KEY_LENGTH, MAX_VALUE_LENGTH } from '../Util';

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
      keyValues: this.state.keyValues.filter(k => k.keyValueId !== keyValue.keyValueId)
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
      value: "",
      keyValueId: generateGUID()
    }
    this.setState({
      keyValues: [newKeyValue, ...this.state.keyValues]
    }) 
  }

  @OF.autobind
  onKeyChanged(key: string, keyValue: KeyValue) {
    let existingKV = this.state.keyValues.find(kv => kv.keyValueId === keyValue.keyValueId)
    let newKeyValue = {...existingKV!, key}

    let index = this.state.keyValues.indexOf(keyValue)
    let keyValues = [...this.state.keyValues]
    keyValues[index] = newKeyValue
    this.setState({keyValues})
  }

  @OF.autobind
  onValueChanged(value: string, keyValue: KeyValue) {
    let existingKV = this.state.keyValues.find(kv => kv.keyValueId === keyValue.keyValueId)
    let newKeyValue = {...existingKV!, value}

    let index = this.state.keyValues.indexOf(keyValue)
    let keyValues = [...this.state.keyValues]
    keyValues[index] = newKeyValue
    this.setState({keyValues})
  }

  @OF.autobind
  onRenderCell(keyValue: KeyValue, index: number, isScrolling: boolean): JSX.Element {
    return (
      <div className="SectionBorder">
        <div className='EditKeyValueSection'>
          <div className="DetailText DetailEditKeyValue">
            <DetailEditText
              label="Key"
              onChanged={key => this.onKeyChanged(key, keyValue)}
              value={keyValue.key}
              autoFocus={keyValue.key === ""}
              maxLength={MAX_KEY_LENGTH}
              minLength={1}
            />
            <DetailEditText
              label="Value"
              onChanged={value => this.onValueChanged(value, keyValue)}
              value={keyValue.value}
              autoFocus={keyValue.key !== "" && keyValue.value === ""}
              maxLength={MAX_VALUE_LENGTH}
              minLength={1}
              rows={2}
              multiline={true}
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

  areValid(): boolean {
    let valid = true
    this.state.keyValues.forEach(kv => {
        if (!isValid(kv.key, 1, MAX_KEY_LENGTH) ||
          !isValid(kv.value, 1, MAX_VALUE_LENGTH)) {
            valid = false
          }
    })
    return valid
  }

  public render() {
    return (
      <div className="ModalPage">
        <div className="HeaderHolder">
          <div className="HeaderContent">
            <OF.IconButton
                className="ButtonIcon ButtonPrimary ButtonTopLeft"
                onClick={this.onClickAdd}
                iconProps={{ iconName: 'CircleAddition' }}
            />
            Key Values
          </div>
        </div>
        <div className="ModalBodyHolder">
          <div className="ModalBodyContent">
            <OF.List
              getKey={item => { return item.keyValueId }}
              items={this.state.keyValues}
              onRenderCell={this.onRenderCell}
            />
          </div>
        </div>
        <div className="FooterHolder"> 
          <div className="FooterContent">
            <OF.IconButton
                disabled={!this.areValid()}
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

export default EditKeyValues;
