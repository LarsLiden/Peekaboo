/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import { Filter, Tag } from '../models/models'
import { expandTagIds } from '../convert'
import '../fabric.css'
import './Detail.css'

export interface ReceivedProps {
  tagIds: string[];
  allTags: Tag[];
  filter: Filter;
  isLong?: boolean;
  inEdit?: boolean;
}

class DetailTags extends React.Component<ReceivedProps, {}> {

  public render() {
      if (!this.props.inEdit && this.props.tagIds.length === 0) {
        return null
      }

      // Get unique parent tags Ids
      let parentIds = [... new Set(expandTagIds(this.props.tagIds, this.props.allTags))]
        .filter(eid => this.props.tagIds.indexOf(eid) === -1)

      return (
        <div className={`DetailText ${this.props.inEdit ? 'DetailEdit'  : ''}`}>
          <div className={`DetailTitle`}>
            Tags
          </div>          
          <div className="DetailBody">
              {this.props.tagIds.map(tagId => {
                const tag = this.props.allTags.find(t => t.tagId === tagId)
                const delimeter = parentIds.length > 0 || (tagId !== this.props.tagIds[this.props.tagIds.length - 1]) ? ",  " : ""
                const isSelected = this.props.filter.requiredTagIds.find(r => r === tagId)
                const name = tag ? tag.name : "- Not Found -"
                if (isSelected) { 
                    return (<span className="TagSelected" key={tagId} >{`${name}${delimeter}`}</span>)
                }
                else {
                    return (<span className="TagUnselected" key={tagId} >{`${name}${delimeter}`}</span>)
                }
              })
            } 
            {
              // Add expanded tags
              parentIds.map(tagId => {
                  const tag = this.props.allTags.find(t => t.tagId === tagId)
                  const delimeter = tagId !== parentIds[parentIds.length - 1] ? ",  " : ""
                  const isSelected = this.props.filter.requiredTagIds.find(r => r === tagId)
                  const name = tag ? tag.name : "- Not Found -"
                  if (isSelected) { 
                      return (<span className="TagParentSelected" key={tagId} >{`${name}${delimeter}`}</span>)
                  }
                  else {
                      return (<span className="TagParent" key={tagId} >{`${name}${delimeter}`}</span>)
                  }
                })
            }
          </div>         
        </div>
    )
  }
}

export default DetailTags;
