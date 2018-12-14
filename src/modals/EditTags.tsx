/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { Tag } from '../models/models'
import AddTag from './AddTag'

export interface ReceivedProps {
  allTags: Tag[]
  personTags: string[]
  onAddTag: (tagName: string) => void
  onSave: (tagNames: string[]) => void
  onCancel: () => void
}

interface ComponentState {
  editTags: Tag[]
  isAddTagModalOpen: boolean
}

class EditTags extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    editTags: [],
    isAddTagModalOpen: false
  }

  componentDidMount() {
    if (this.state.editTags.length === 0) {
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

  componentWillReceiveProps(newProps: ReceivedProps) {
    // Look for newly created tags
    let newTags = newProps.allTags.filter(t => 
        this.state.editTags.find(et => et.name === t.name) === undefined
    )

    // Assume any newly created tags should be added to person
    newTags.forEach(t => {
      t.count = 1
    })

    this.setState({
      editTags: [...newTags, ...this.state.editTags]
    })
  }

  @OF.autobind
  onClickAddTag() {
    this.setState({
      isAddTagModalOpen: true
    })
  }

  @OF.autobind
  onCreateNewTag(tag: string) {
    this.setState({
      isAddTagModalOpen: false
    })
    this.props.onAddTag(tag)
  }

  @OF.autobind
  onCancelNewTag() {
    this.setState({
      isAddTagModalOpen: false
    })
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
      <div>
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
      <div>
        {this.state.isAddTagModalOpen 
          ? 
            <AddTag
              onCreate={this.onCreateNewTag}
              onCancel={this.onCancelNewTag}
            />
          :
          <div className="ModalPage">
            <div className="HeaderHolder">
              <div className="HeaderContent">
                <OF.IconButton
                    className="ButtonIcon ButtonPrimary ButtonTopLeft"
                    onClick={this.onClickAddTag}
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
