/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { Tag } from '../models/models'

export interface ReceivedProps {
  allTags: Tag[]
  personTags: string[]
  onSave: (tagNames: string[]) => void
  onCancel: () => void
}

interface ComponentState {
  editTags: Tag[]
}

class EditTags extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    editTags: []
  }

  componentDidMount() {
    if (this.state.editTags.length == 0) {
      let editTags = this.props.allTags.map(tag => {
        return {
          name: tag.name,
          count: this.props.personTags.find(s => s === tag.name) ? 1 : 0
        }
      })

      this.setState({
        editTags
      })   
    }
  }

  @OF.autobind
  onClickSave() {
    let tagNames = this.state.editTags.filter(t => t.count === 1).map(t => t.name)
    this.props.onSave(tagNames)
  }

  @OF.autobind
  onCheckboxChange(isChecked: boolean = false, tag: Tag) {
    let editTags = [...this.state.editTags]
    let curTag = editTags.find(t => t.name === tag.name)
    if (isChecked) {
      curTag!.count = 1
      this.setState({editTags})
    }
    else {
      curTag!.count = 0
      this.setState({editTags})
    }
  }

  @OF.autobind
  onRenderCell(tag: Tag, index: number, isScrolling: boolean): JSX.Element {
    return (
      <div className="FilterLine">
        <div className="FilterName">
          {tag.name}
        </div>
        <OF.Checkbox 
          className={`FilterCheckbox FilterCheckboxInclude${tag.count > 0 ? ' FilterCheckboxIncludeSelected' : ''}`}
          onChange={(ev, isChecked) => this.onCheckboxChange(isChecked, tag)}
          checked={tag.count > 0}
        />
      </div>
    );
  }

  public render() {
    return (
      <div className="ModalPage">
        <div className="ContentHeader FilterHeader">
          Tags
        </div>
        <div className="ModalBody">
          <OF.List
            className="FilterList"
            items={this.state.editTags}
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
              iconProps={{ iconName: 'Cancel' }}
          />
        </div>
      </div>
    );
  }
}

export default EditTags;
