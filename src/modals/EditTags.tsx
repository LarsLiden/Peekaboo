/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { Tag } from '../models/models'
import { sortTags } from '../convert'
import AddEditTag from './AddEditTag'

export interface ReceivedProps {
  allTags: Tag[]
  tagIds: string[]
  onSaveTag: (tag: Tag) => void
  onDeleteTag: (tag: Tag) => void
  onSavePersonTags: (tagNames: string[]) => void
  onCancel: () => void
}

interface ComponentState {
  editTags: Tag[]
  isEditTagModalOpen: boolean
  editingTag: Tag | null
}

class EditTags extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    editTags: [],
    isEditTagModalOpen: false,
    editingTag: null
  }

  componentDidMount() {
    this.setEditTags(this.props.allTags, this.props.tagIds)
  }

  componentWillReceiveProps(newProps: ReceivedProps) {
    // Look for newly created tags
    let newTags = newProps.allTags.filter(t => 
        this.state.editTags.find(et => et.tagId === t.tagId) === undefined)

    // Assume any newly created tags should be added to person
    newTags.forEach(t => {
      t.count = 1
    })

    this.setEditTags(newProps.allTags, newProps.tagIds)
  }

  setEditTags(allTags: Tag[], tagIds: string[]) {
    let editTags = allTags.map(tag => {
      return {
        ...tag,
        count: tagIds.find(s => s === tag.tagId) ? 1 : 0
      }
    })

    editTags = sortTags(editTags)

    this.setState({
      editTags
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
  onCancelEditTag() {
    this.setState({
      isEditTagModalOpen: false,
      editingTag: null
    })
  }

  @OF.autobind
  onClickSave() {
    let tagNames = this.state.editTags.filter(t => t.count === 1).map(t => t.tagId!)
    this.props.onSavePersonTags(tagNames)
  }

  @OF.autobind
  onCheckboxChange(isChecked: boolean = false, tag: Tag) {
    let editTags = [...this.state.editTags]
    let curTag = editTags.find(t => t.tagId === tag.tagId)
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
  async onDeleteTag(tag: Tag) {
    await this.props.onDeleteTag(tag)
  }

  spacer(spacer: string): JSX.Element {
    return (<span className="TagSpacer">{`${spacer}`}</span>)
  }

  namePrefix(tag: Tag): JSX.Element[] {
    if (!tag.parentId) {
      return []
    }
    else {
      let parent = this.props.allTags.find(t => t.tagId === tag.parentId)
      if (!parent) {
        return []
      }
      let namePrefix = this.namePrefix(parent)
      if (namePrefix.length > 0) {
        return [this.spacer(` `), ...this.namePrefix(parent)]
      }
      return [this.spacer("└")]
    }
  }
  @OF.autobind
  onRenderCell(tag: Tag, index: number, isScrolling: boolean): JSX.Element {
    return (
      <div>
        <div className="FilterName">
          {this.namePrefix(tag)}
          {` ${tag.name}`}
        </div>
        <OF.Checkbox 
          className={`FilterCheckbox FilterCheckboxInclude${tag.count > 0 ? ' FilterCheckboxIncludeSelected' : ''}`}
          onChange={(ev, isChecked) => this.onCheckboxChange(isChecked, tag)}
          checked={tag.count > 0}
        />
        <OF.IconButton
          className="ButtonIcon ButtonSmallDark"
          onClick={() => this.onClickEditTag(tag)}  
          iconProps={{ iconName: 'Settings' }}
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
              </div>
            </div>
            <div className="ModalBodyHolder">
              <div className="ModalBodyContent">
                <OF.List
                  items={this.state.editTags}
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
