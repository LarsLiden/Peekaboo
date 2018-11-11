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
}

interface ComponentState { 
  inEditMode: boolean
}

class DetailTags extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    inEditMode: false
  }
/*
  @OF.autobind
  private onRenderTag(tag: string): JSX.Element {
    const isSelected = this.props.filter.required.find(r => r === tag)
    if (isSelected) {
      return (
        <span className="TagSelected">{tag}</span>
      )
    }
    else {
      return (
        <span className="TagUnselected">{tag}</span>
      )
    }
  }*/

  public render() {
      if (this.props.tags.length === 0) {
        return null
      }
      return (
        <div className="DetailText">
          <div className="DetailTitle">
            Tags
          </div>          
          <div>
              {this.props.tags.map(tag => {
                const isSelected = this.props.filter.required.find(r => r === tag)
                if (isSelected) { 
                    return (<span className="TagSelected">{`${tag}  `}</span>)
                }
                else {
                    return (<span className="TagUnselected">{`${tag}  `}</span>)
                }
              })
            }
          </div>         
        </div>
    )
  }
}

export default DetailTags;
