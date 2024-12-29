/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { Person } from '../models/person'
import { Tag, Filter, SortType, SortDirection } from '../models/models'
import { autobind } from 'core-decorators'

export interface ReceivedProps {
  allPeople: Person[];
  allTags: Tag[];
  filter: Filter;
  onClose: (filter: Filter) => void;
}

interface ComponentState {
  sortTypes: { key: string; text: any; }[];
  sortDirections: { key: string; text: any; }[];
  filter: Filter;
}

class SortPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    sortTypes: Object.keys(SortType).map(e => {
      return {key: SortType[e], text: SortType[e]}
    }),
    sortDirections: Object.keys(SortDirection).map(e => {
      return {key: SortDirection[e], text: SortDirection[e]}
    }),
    filter: {...this.props.filter}
  }

  componentDidMount() {
    this.setState({
      filter: {...this.props.filter}
    })   
  }

  @autobind
  onClickClose() {
    this.props.onClose(this.state.filter)
  }

  @autobind 
  onSortTypeChange(option: OF.IDropdownOption) {
    this.setState({ 
      filter: {...this.state.filter, sortType: SortType[option.text]}
    })
  }

  @autobind 
  onSortDirectionChange(option: OF.IDropdownOption) {
    this.setState({
       filter: {...this.state.filter, sortDirection: SortDirection[option.text]}
    })
  }

  public render() {
    return (
      <div className="ModalPage">
        <div className="HeaderHolder">
          <div className="HeaderContent">
            Sort
          </div>
        </div>
        <div className="ContentBody">
          <div className="SortItem">
            <div>By</div>
            <OF.Dropdown
              className="SortDropdown"
              defaultSelectedKey={this.state.filter.sortType}
              options={this.state.sortTypes}
              onChanged={this.onSortTypeChange}
            />
          </div>
          <div className="SortItem">
            <div>Direction</div>
            <OF.Dropdown
              className="SortDropdown"
              defaultSelectedKey={this.state.filter.sortDirection}
              options={this.state.sortDirections}
              onChanged={this.onSortDirectionChange}
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
          </div>
        </div>
      </div>
    );
  }
}

export default SortPage;
