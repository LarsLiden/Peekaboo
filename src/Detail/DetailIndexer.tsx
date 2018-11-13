/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import DetailCounter from './DetailCounter'
import '../fabric.css'
import './Detail.css'

export interface ReceivedProps {
  onPrev: () => void
  onNext: () => void
  isVertical: boolean
  currentIndex: number
  total: number
}

interface ComponentState { 
  inEditMode: boolean
}

class DetailText extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    inEditMode: false
  }

  public render() {

    return (
      <div
        className={`DetailIndexer${this.props.isVertical ? " DetailIndexerVertical" : ""}`}
        >
        <OF.IconButton
          className="ButtonIcon ButtonPrimary"
          onClick={this.props.onPrev}
          iconProps={{ iconName: this.props.isVertical ? 'CaretUpSolid8' : 'CaretLeftSolid8' }}
        />
        <div
          className={this.props.isVertical ? 'DetailCounterVertical' : 'DetailCounterHorizontal'}
        >
          <DetailCounter
            current={this.props.currentIndex}
            total={this.props.total}
          />
        </div>
        <OF.IconButton
          className="ButtonIcon ButtonPrimary"
          onClick={this.props.onNext}
          iconProps={{ iconName: this.props.isVertical ? 'CaretDownSolid8' : 'CaretRightSolid8' }}
        />
      </div>
    )
  }
}

export default DetailText;
