import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { Filter } from './models/models'
import './fabric.css'
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

  @OF.autobind
  private onRenderCell(tag: string, index: number, isScrolling: boolean): JSX.Element {
    const isSelected = this.props.filter.required.find(r => r === tag)
    if (isSelected) {
      return (
        <div className="TagSelected">{tag}</div>
      )
    }
    else {
      return (
        <div className="TagUnselected">{tag}</div>
      )
    }
  }

  public render() {

      return (
        <div className="DetailText">
          <div className="DetailTitle">
            Tags
          </div>
          <OF.List
              className="TagList"
              items={this.props.tags}
              onRenderCell={this.onRenderCell}
          />
        </div>

    );
  }
}

export default DetailTags;
