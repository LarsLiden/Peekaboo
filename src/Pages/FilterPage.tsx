/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { Tag, Filter } from '../models/models'

export interface ReceivedProps {
  tags: Tag[]
  filter: Filter
  peopleCount: number
  onClose: () => void
  onSetRequireTag: (tagName: string, value: boolean) => void
  onSetBlockTag: (tagName: string, value: boolean) => void
}

class FilterPage extends React.Component<ReceivedProps, {}> {

  @OF.autobind
  onClickClose() {
    this.props.onClose()
  }

  @OF.autobind
  onCheckboxRequireChange(isChecked: boolean = false, tag: Tag) {
    this.props.onSetRequireTag(tag.name, isChecked)
  }

  @OF.autobind
  onCheckboxBlockChange(isChecked: boolean = false, tag: Tag) {
    this.props.onSetBlockTag(tag.name, isChecked)
  }

  @OF.autobind
  onRenderCell(item: Tag, index: number, isScrolling: boolean): JSX.Element {
    let isRequired = this.props.filter.required.indexOf(item.name) > -1
    let isBlocked = this.props.filter.blocked.indexOf(item.name) > -1
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
          {this.props.peopleCount} People Selected
        </div>
        <OF.List
          className="FilterList"
          items={this.props.tags}
          onRenderCell={this.onRenderCell}
        />
        <div
          className="ContentFooter"
        >
          <OF.DefaultButton
              className="QuizButton"
              onClick={this.onClickClose}
              text="Done"
          />  
        </div>
      </div>
    );
  }
}

export default FilterPage;
