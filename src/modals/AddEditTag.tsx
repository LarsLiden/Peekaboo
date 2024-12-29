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
import { expandTagIds } from '../convert'
import { autobind } from 'core-decorators'
import "../Pages/ViewPage.css"

export interface ReceivedProps {
  tag: Tag | null;
  allTags: Tag[];
  onSubmit: (tag: Tag) => void;
  onCancel: () => void;
  onDelete: () => void;
}

interface ComponentState { 
  tagName: string;
  parentId: string | null;
  parents: { key: string; text: any; }[];
}

const NONE_KEY = "NONE"

class AddEditTag extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    tagName: "",
    parentId: null,
    parents: []
  }

  parents(): { key: string; text: any; }[] {
    let allowedTags: Tag[]

    if (!this.props.tag) {
      allowedTags = this.props.allTags
    }
    else {
      // Prevent loops by not allowing children as parents
      allowedTags = this.props.allTags.filter(t => {
        if (t === this.props.tag) {
          return false
        }
        const parentIds = expandTagIds([t.tagId!], this.props.allTags).filter(et => et !== t.tagId)
        return (parentIds.find(eid => eid === this.props.tag!.tagId!) === undefined)
        }
      )
    }
      
    let types = allowedTags.map(t => {
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
    let parents = this.parents()
    if (this.props.tag) {
      this.setState({
        tagName: this.props.tag.name,
        parentId: this.props.tag.parentId || NONE_KEY,
        parents
      })   
    }
    else {
      this.setState({parents})
    }
  }

  @autobind
  onTagNameChanged(text: string | undefined ) {
    this.setState({tagName: text || ""})
  }

  @autobind 
  onParentChange(option: OF.IDropdownOption) {
    this.setState({ parentId: option.key as string })
  }
  
  @autobind
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

  @autobind
  onClickCancel(): void {
    this.props.onCancel()
  }

  @autobind
  onClickDelete(): void {
    this.props.onDelete()
  }

  public render() {
    return (
      <div className="ModalPage">
          <div className="HeaderHolder">
            <div className="HeaderContent">
              Edit Tag
              {this.props.tag && this.props.tag.count === 0 &&
                <OF.IconButton
                    className="ButtonIcon ButtonDarkPrimary ButtonTopRight"
                    onClick={this.onClickDelete}
                    iconProps={{ iconName: 'Trash' }}
                />
              }
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
                  <div className="DetailTitle DetailTitlePlain">
                    {`Used By ${this.props.tag ? this.props.tag.count : 0} People`}
                  </div>
                </div>
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
