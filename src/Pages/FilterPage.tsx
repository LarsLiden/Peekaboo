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
  onDeleteTag: (tag: Tag) => void
  onEditTags: () => void
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
    filter: {...this.props.filter},
  }

  componentDidMount() {
    this.setState({
      filter: {...this.props.filter}
    })   
    this.updateTags()
  }

  updateTags() {
    let filteredPeople = Convert.filterPeople(this.props.allPeople, this.props.allTags, this.state.filter)
    let filteredTags = Convert.filterTags(filteredPeople, this.props.allPeople, this.props.allTags, this.state.filter)
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
        requiredTagIds: [],
        blockedTagIds: [],
        searchTerm: null,
        perfType: PerfType.PHOTO
      }
    }, () => this.updateTags())
  }

  @OF.autobind
  onCheckboxRequireChange(isChecked: boolean = false, tag: Tag) {
    if (isChecked) {
      if (this.state.filter.requiredTagIds.indexOf(tag.tagId!) <= 0) {
        let blockedTagIds = this.state.filter.blockedTagIds.filter(tid => tid !== tag.tagId)
        let requiredTagIds = [...this.state.filter.requiredTagIds, tag.tagId!] 
        this.setState({
          filter: {...this.state.filter,
            requiredTagIds,
            blockedTagIds,
            perfType: PerfType.PHOTO
          }
        }, () => this.updateTags())
      }
    }
    else {
      let requiredTagIds = this.state.filter.requiredTagIds.filter(tid => tid !== tag.tagId)
      this.setState({
        filter: {
          ...this.state.filter,
          requiredTagIds
        }
      }, () => this.updateTags())
    }
  }

  @OF.autobind
  onCheckboxBlockChange(isChecked: boolean = false, tag: Tag) {
    if (isChecked) { 
      if (this.state.filter.blockedTagIds.indexOf(tag.tagId!) <= 0) {
        let blockedTagIds = [...this.state.filter.blockedTagIds, tag.tagId!] 
        let requiredTagIds = this.state.filter.requiredTagIds.filter(tid => tid !== tag.tagId)
        this.setState({
          filter: {
            ...this.state.filter,
            requiredTagIds,
            blockedTagIds
          }
        }, () => this.updateTags())
      }
    }
    else {
      let blockedTagIds = this.state.filter.blockedTagIds.filter(tid => tid !== tag.tagId)
      this.setState({
        filter: {
          ...this.state.filter,
          blockedTagIds
        }
      }, () => this.updateTags())
    }
  }

  @OF.autobind
  async onDeleteTag(tag: Tag) {
    await this.props.onDeleteTag(tag)
    this.updateTags()
  }

  @OF.autobind
  onRenderCell(item: Tag, index: number, isScrolling: boolean): JSX.Element {
    let isRequired = this.state.filter.requiredTagIds.indexOf(item.tagId!) > -1
    let isBlocked = this.state.filter.blockedTagIds.indexOf(item.tagId!) > -1

    let includeClass = (item.count === 0)
      ? `FilterCheckbox FilterCheckboxDisabled`
      : `FilterCheckbox FilterCheckboxInclude${isRequired ? ' FilterCheckboxIncludeSelected' : ''}`
    let blockClass = (item.count === 0)
      ? `FilterCheckbox FilterCheckboxDisabled`
      : `FilterCheckbox FilterCheckboxBlock${isBlocked ? ' FilterCheckboxBlockSelected' : ''}`

    return (
      <div className="SectionBorder">
        <div 
          className={`FilterName${isBlocked ? ' StrikeThrough' : ''}`}
        >
          {item.name}
        </div>
        <div className="FilterNumber">{isBlocked ? "" : item.count}</div>
        <OF.Checkbox
          disabled={item.count === 0} 
          className={includeClass}
          onChange={(ev, isChecked) => this.onCheckboxRequireChange(isChecked, item)}
          checked={isRequired}
        />
        <div
          className="FilterSpacer"
        />
        <OF.Checkbox 
          disabled={item.count === 0} 
          className={blockClass}
          onChange={(ev, isChecked) => this.onCheckboxBlockChange(isChecked, item)} 
          checked={isBlocked}
        />
      </div>
    )
  }

  public render() {
    return (
      <div className="ModalPage">
        <div className="HeaderHolder">
          <div className="HeaderContent">
            {this.state.filteredPeople.length} People Selected
            <OF.IconButton
              className="ButtonIcon ButtonDarkPrimary ButtonTopRight"
              onClick={this.props.onEditTags}
              iconProps={{ iconName: 'Edit' }}
            />
          </div>
        </div>
        <div className="ModalBodyHolder">
          <div className="ModalBodyContent">
            <OF.List
              items={this.state.filteredTags}
              onRenderCell={this.onRenderCell}
            />
            </div>
          </div>
        <div className="FooterHolder">
          <div className="FooterContent" >
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
      </div>
    );
  }
}

export default FilterPage;
