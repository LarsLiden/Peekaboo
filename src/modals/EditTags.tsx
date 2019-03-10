/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { Tag } from '../models/models'
import AddEditTag from './AddEditTag'
import { expandTagIds } from '../convert'

export interface ReceivedProps {
  allTags: Tag[]
  tagIds: string[]
  onSaveTag: (tag: Tag) => void
  onSavePersonTags: (tagNames: string[]) => void
  onDeleteTag: (tag: Tag) => void
  onEditTags: () => void
  onCancel: () => void
}

interface ComponentState {
  personTags: Tag[]
  isEditTagModalOpen: boolean
  editingTag: Tag | null
}

class EditTags extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    personTags: [],
    isEditTagModalOpen: false,
    editingTag: null
  }

  componentDidMount() {
    this.setPersonTags(this.props.allTags, this.props.tagIds)
  }

  componentWillReceiveProps(newProps: ReceivedProps) {
    // Look for newly created tags
    let newTags = newProps.allTags.filter(t => 
        this.state.personTags.find(et => et.tagId === t.tagId) === undefined)

    // Assume any newly created tags should be added to person
    newTags.forEach(t => {
      t.count = 1
    })

    this.setPersonTags(newProps.allTags, newProps.tagIds)
  }

  setPersonTags(allTags: Tag[], tagIds: string[]) {

    let expandedIds = expandTagIds(tagIds, allTags)
    let editTags = allTags.map(tag => {
      return {
        ...tag,
        // Encode direct add as 1, expanded as 2, not included a 0
        count: expandedIds.find(s => s === tag.tagId) ? tagIds.find(s => s === tag.tagId) ? 1 : 2 : 0
      }
    })

    editTags = editTags.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1 }
      else if (b.name.toLowerCase() < a.name.toLowerCase()) { return 1 }
      else { return 0 }
    })

    this.setState({
      personTags: editTags
    })   
  }

  @OF.autobind
  onClickEditTag(tag: Tag | null) {
    this.setState({
      isEditTagModalOpen: true,
      editingTag: tag
    })
  }

  @OF.autobind
  onSubmitEditTag(tag: Tag) {
    this.setState({
      isEditTagModalOpen: false,
      editingTag: null
    })
    this.props.onSaveTag(tag)
  }

  @OF.autobind
  onDeleteEditTag() {
    if (this.state.editingTag) {
      this.props.onDeleteTag(this.state.editingTag)
    }

    this.setState({
      isEditTagModalOpen: false,
      editingTag: null
    })
  }

  @OF.autobind
  onCancelEditTag() {
    this.setState({
      isEditTagModalOpen: false,
      editingTag: null
    })
  }

  @OF.autobind
  onClickSave() {
    let tagNames = this.state.personTags.filter(t => t.count === 1).map(t => t.tagId!)
    this.props.onSavePersonTags(tagNames)
  }

  @OF.autobind
  onCheckboxChange(isChecked: boolean = false, tag: Tag) {
    // Can't change status of auto inluded parent tags
    if (tag.count === 2) {
      return 
    }
    let selectedTagIds = this.state.personTags.filter(t => t.count === 1).map(t => t.tagId!)
    let index = selectedTagIds.findIndex(tid => tid === tag.tagId)
    if (index === -1) {
      selectedTagIds.push(tag.tagId!)
    }
    else {
      selectedTagIds.splice(index, 1)
    }

    this.setPersonTags(this.props.allTags, selectedTagIds)
  }

  spacer(spacer: string): JSX.Element {
    return (<span className="TagSpacer">{`${spacer}`}</span>)
  }

  @OF.autobind
  onRenderCell(tag: Tag, index: number, isScrolling: boolean): JSX.Element {
    let className = `FilterCheckbox FilterCheckboxInclude`
    if (tag.count === 1) {
      className = `${className} FilterCheckboxIncludeSelected`
    }
    else if (tag.count === 2) {
      className = `${className} FilterCheckboxIncludeParent`
    }
    return (
      <div>
        <div className="FilterName">
          {tag.name}
        </div>
        <OF.Checkbox 
          className={className}
          onChange={(ev, isChecked) => this.onCheckboxChange(isChecked, tag)}
          checked={tag.count > 0}
        />
      </div>
    );
  }

  public render() {
    return (
      <div>
        {this.state.isEditTagModalOpen 
          ? 
            <AddEditTag
              tag={this.state.editingTag}
              allTags={this.props.allTags}
              onSubmit={this.onSubmitEditTag}
              onCancel={this.onCancelEditTag}
              onDelete={this.onDeleteEditTag}
            />
          :
          <div className="ModalPage">
            <div className="HeaderHolder">
              <div className="HeaderContent">
                <OF.IconButton
                    className="ButtonIcon ButtonPrimary ButtonTopLeft"
                    onClick={() => this.onClickEditTag(null)}
                    iconProps={{ iconName: 'CircleAddition' }}
                />
                Tags
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
                  items={this.state.personTags}
                  onRenderCell={this.onRenderCell}
                />
              </div>
            </div>
            <div className="FooterHolder"> 
              <div className="FooterContent">
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
          </div>
        }
      </div>
    );
  }
}

export default EditTags;
