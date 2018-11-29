/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import * as Convert from '../convert'
import { Person } from '../models/person'
import { Tag, Filter, PerfType } from '../models/models'

export interface ReceivedProps {
  allPeople: Person[]
  allTags: Tag[]
  filter: Filter
  onClose: (filter: Filter) => void
}

interface ComponentState {
  filteredTags: Tag[]
  filteredPeople: Person[]
  filter: Filter
}

class FilterPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    filteredTags: [],
    filteredPeople: [],
    filter: {...this.props.filter}
  }

  componentDidMount() {
    this.setState({
      filter: {...this.props.filter}
    })   
    this.updateTags()
  }

  updateTags() {
    let filteredPeople = Convert.filteredPeople(this.props.allPeople, this.state.filter)
    let filteredTags = Convert.filteredTags(filteredPeople, this.props.allPeople, this.state.filter)
      this.setState({
        filteredTags,
        filteredPeople
      })
  }

  @OF.autobind
  onClickClose() {
    this.props.onClose(this.state.filter)
  }

  @OF.autobind
  onClickClear() {
    this.setState({
      filter: {...this.state.filter,
        required: [],
        blocked: [],
        perfType: PerfType.PHOTO
      }
    }, () => this.updateTags())
  }

  @OF.autobind
  onCheckboxRequireChange(isChecked: boolean = false, tag: Tag) {
    if (isChecked) {
      if (this.state.filter.required.indexOf(tag.name) <= 0) {
        let blocked = this.state.filter.blocked.filter(t => t !== tag.name)
        let required = [...this.state.filter.required, tag.name] 
        this.setState({
          filter: {...this.state.filter,
            required,
            blocked,
            perfType: PerfType.PHOTO
          }
        }, () => this.updateTags())
      }
    }
    else {
      let required = this.state.filter.required.filter(t => t !== tag.name)
      this.setState({
        filter: {
          ...this.state.filter,
          required
        }
      }, () => this.updateTags())
    }
  }

  @OF.autobind
  onCheckboxBlockChange(isChecked: boolean = false, tag: Tag) {
    if (isChecked) { 
      if (this.state.filter.blocked.indexOf(tag.name) <= 0) {
        let blocked = [...this.state.filter.blocked, tag.name] 
        let required = this.state.filter.required.filter(t => t !== tag.name)
        this.setState({
          filter: {
            ...this.state.filter,
            required,
            blocked
          }
        }, () => this.updateTags())
      }
    }
    else {
      let blocked = this.state.filter.blocked.filter(t => t !== tag.name)
      this.setState({
        filter: {
          ...this.state.filter,
          blocked
        }
      }, () => this.updateTags())
    }
  }

  @OF.autobind
  onRenderCell(item: Tag, index: number, isScrolling: boolean): JSX.Element {
    let isRequired = this.state.filter.required.indexOf(item.name) > -1
    let isBlocked = this.state.filter.blocked.indexOf(item.name) > -1
    return (
      <div className="FilterLine">
        <div 
          className={`FilterName${isBlocked ? ' StrikeThrough' : ''}`}
        >
          {item.name}
        </div>
        <div className="FilterNumber">{isBlocked ? "" : item.count}</div>
        <OF.Checkbox 
          className={`FilterCheckbox FilterCheckboxInclude${isRequired ? ' FilterCheckboxIncludeSelected' : ''}`}
          onChange={(ev, isChecked) => this.onCheckboxRequireChange(isChecked, item)}
          checked={isRequired}
        />
        <div
          className="FilterSpacer"
        />
        <OF.Checkbox 
          className={`FilterCheckbox FilterCheckboxBlock${isBlocked ? ' FilterCheckboxBlockSelected' : ''}`}
          onChange={(ev, isChecked) => this.onCheckboxBlockChange(isChecked, item)} 
          checked={isBlocked}
        /> 
      </div>
    );
  }

  public render() {
    return (
      <div className="FilterPage">
        <div className="ContentHeader FilterHeader">
          {this.state.filteredPeople.length} People Selected
        </div>
        <OF.List
          className="FilterList"
          items={this.state.filteredTags}
          onRenderCell={this.onRenderCell}
        />
        <div className="ContentFooter" >
          <OF.IconButton
              className="ButtonIcon ButtonPrimary FloatLeft"
              onClick={this.onClickClose}
              iconProps={{ iconName: 'ChromeBack' }}
          />
          <OF.IconButton
              className="ButtonIcon ButtonPrimary FloatRight"
              onClick={this.onClickClear}
              iconProps={{ iconName: 'ClearFilter' }}
          />
        </div>
      </div>
    );
  }
}

export default FilterPage;
