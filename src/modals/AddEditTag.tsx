/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { Tag } from '../models/models'
import '../fabric.css'
import { isValid, MAX_TAG_LENGTH, generateGUID } from '../Util'
import DetailEditText from '../Detail/DetailEditText'
import "../Pages/ViewPage.css"

export interface ReceivedProps {
  tag: Tag | null
  allTags: Tag[]
  onSubmit: (tag: Tag) => void
  onCancel: () => void
  onDelete:( ) => void
}

interface ComponentState { 
  tagName: string
  parentId: string | null
  defaultKey: { key: string; text: any; }  | undefined
  parents: { key: string; text: any; }[]
}

const NONE_KEY = "NONE"

class AddEditTag extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    tagName: "",
    parentId: null,
    defaultKey: undefined,
    parents: []
  }

  parents(): { key: string; text: any; }[] {
    let types = this.props.allTags.map(t => {
      return {key: t.tagId!, text: t.name}
    })
    types = types.sort((a, b) => {
      if (a.text < b.text) { return -1 }
      else if (b.text < a.text) { return 1 }
      else { return 0 }
    })
    types.push({key: NONE_KEY, text: "- None -"})
    return types
  }

  componentDidMount() {
    if (this.props.tag) {
      let parents = this.parents()
      let defaultKey = parents.find(p => (this.props.tag !== null && p.key === this.props.tag.parentId))
      this.setState({
        tagName: this.props.tag.name,
        parentId: this.props.tag.parentId || NONE_KEY,
        defaultKey,
        parents
      })   
    }
  }

  @OF.autobind
  onTagNameChanged(text: string) {
    this.setState({tagName: text})
  }

  @OF.autobind 
  onParentChange(option: OF.IDropdownOption) {
    this.setState({ parentId: option.key as string })
  }
  
  @OF.autobind
  onClickSave(): void {
    if (isValid(this.state.tagName, 1, MAX_TAG_LENGTH)) {
      let tag: Tag = {
        name: this.state.tagName,
        parentId: this.state.parentId !== NONE_KEY ? this.state.parentId : null,
        tagId: this.props.tag ? this.props.tag.tagId : generateGUID(),
        count: this.props.tag ? this.props.tag.count : 0
      }
      this.props.onSubmit(tag)
    }
  }

  @OF.autobind
  onClickCancel(): void {
    this.props.onCancel()
  }

  @OF.autobind
  onClickDelete(): void {
    this.props.onDelete()
  }

  public render() {
    return (
      <div className="ModalPage">
          <div className="HeaderHolder">
            <div className="HeaderContent">
              Edit Tag
            </div>
          </div>
          <div className="ModalBodyHolder">
            <div className="ModalBodyContent">
              <div>
              <div className="TagEdit">
                <DetailEditText
                  label="Tag Name"
                  onChanged={text => this.onTagNameChanged(text)}
                  value={this.state.tagName}
                  onEnter={this.onClickSave}
                  autoFocus={true}
                  maxLength={MAX_TAG_LENGTH}
                />
                <div className="DetailTitle DetailTitlePlain">
                Parent Tag
                </div>
                {this.state.parents && (this.state.parents.length > 0) &&
                  <OF.Dropdown
                    defaultSelectedKey={this.state.parentId || NONE_KEY}
                    options={this.state.parents}
                    onChanged={this.onParentChange}
                  />
                }
              </div>
              {this.props.tag &&
                <OF.IconButton
                    className="ButtonIcon ButtonDark FloatRight"
                    onClick={this.onClickDelete}
                    iconProps={{ iconName: 'Trash' }}
                />
              }
              </div>
              
            </div>
          </div>
          <div className="FooterHolder"> 
            <div className="FooterContent">
              <OF.IconButton
                  disabled={!isValid(this.state.tagName, 1, MAX_TAG_LENGTH)}
                  className="ButtonIcon ButtonPrimary FloatLeft"
                  onClick={this.onClickSave}
                  iconProps={{ iconName: 'Save' }}
              />
              <OF.IconButton
                  className="ButtonIcon ButtonPrimary FloatRight"
                  onClick={this.onClickCancel}
                  iconProps={{ iconName: 'ChromeClose' }}
              />
            </div>
          </div>
      </div>
    );
  }
}

export default AddEditTag;
