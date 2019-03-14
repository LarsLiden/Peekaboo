/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { Tag } from '../models/models'
import { Person } from '../models/person'
import { sortTags, expandTagIds } from '../convert'
import AddEditTag from '../modals/AddEditTag'

export interface ReceivedProps {
  allTags: Tag[]
  allPeople: Person[]
  onSaveTag: (tag: Tag) => void
  onDeleteTag: (tag: Tag) => void
  onClose: () => void
}

interface ComponentState {
  sortedTags: Tag[]
  isEditTagModalOpen: boolean
  editingTag: Tag | null
}

class TagEditorPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    sortedTags: [],
    isEditTagModalOpen: false,
    editingTag: null
  }

  componentDidMount() {
    this.setEditTags(this.props.allTags, this.props.allPeople)
  }

  componentWillReceiveProps(newProps: ReceivedProps) {
    this.setEditTags(newProps.allTags, newProps.allPeople)
  }

  setEditTags(allTags: Tag[], allPeople: Person[]) {
    // Recalculate tag count
    allTags.forEach(tag => tag.count = 0)
    const tagCount: { [s: string]: number } = {}
    allPeople.forEach(p => {
      let expandedIds = expandTagIds(p.tagIds, allTags)
      expandedIds.forEach(tid => {
        if (tagCount[tid]) {
          tagCount[tid] = tagCount[tid] + 1
        }
        else {
          tagCount[tid] = 1
        }
      })
    })
    Object.keys(tagCount).forEach(k => {
      const tag = allTags.find(t => t.tagId === k)
      if (tag) {
        tag.count = tagCount[k]
      }
      else {
        throw new Error("Missing TAG!")
      }
    })

    this.setState({
      sortedTags: sortTags(allTags)
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
  onCheckboxChange(isChecked: boolean = false, tag: Tag) {
    let editTags = [...this.state.sortedTags]
    let curTag = editTags.find(t => t.tagId === tag.tagId)
    if (isChecked) {
      curTag!.count = 1
      this.setState({sortedTags: editTags})
    }
    else {
      curTag!.count = 0
      this.setState({sortedTags: editTags})
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
      <div
        key={`${tag.name}_DIV`}
      >
        <div className="FilterName">
          {this.namePrefix(tag)}
          {` ${tag.name}`}
        </div>
        <div className="TagCount">
          {` ${tag.count}`}
        </div>
        <OF.IconButton
          key={`${tag.name}_BUTTON`}
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
              </div>
            </div>
            <div className="ModalBodyHolder">
              <div className="ModalBodyContent">
                <OF.List
                  items={this.state.sortedTags}
                  onRenderCell={this.onRenderCell}
                />
              </div>
            </div>
            <div className="FooterHolder"> 
              <div className="FooterContent">
                <OF.IconButton
                    className="ButtonIcon ButtonPrimary FloatRight"
                    onClick={this.props.onClose}
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

export default TagEditorPage;
