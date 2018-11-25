/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import { Filter } from '../models/models'
import '../fabric.css'
import './Detail.css'

export interface ReceivedProps {
  tags: string[]
  filter: Filter
  isLong?: boolean
  inEdit?: boolean
}

class DetailTags extends React.Component<ReceivedProps, {}> {

  public render() {
      if (!this.props.inEdit && this.props.tags.length === 0) {
        return null
      }
      return (
        <div className={`DetailText ${this.props.inEdit ? 'DetailEdit'  : ''}`}>
          <div className={`DetailTitle ${this.props.inEdit ? 'DetailEditTitle'  : ''}`}>
            Tags
          </div>          
          <div className="DetailTags">
              {this.props.tags.map(tag => {
                const delimeter = tag !== this.props.tags[this.props.tags.length - 1] ? ",  " : ""
                const isSelected = this.props.filter.required.find(r => r === tag)
                if (isSelected) { 
                    return (<span className="TagSelected" key={tag} >{`${tag}${delimeter}`}</span>)
                }
                else {
                    return (<span className="TagUnselected" key={tag} >{`${tag}${delimeter}`}</span>)
                }
              })
            }
          </div>         
        </div>
    )
  }
}

export default DetailTags;
