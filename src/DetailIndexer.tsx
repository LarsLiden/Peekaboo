import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import DetailCounter from './DetailCounter'
import './fabric.css'
import './Detail.css'

export interface ReceivedProps {
  onPrev: () => void
  onNext: () => void
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
        className="DetailIndexer"
        >
        <OF.IconButton
          className="ImageButton"
          onClick={this.props.onPrev}
          iconProps={{ iconName: 'CaretLeftSolid8' }}
        />
        <DetailCounter
          current={this.props.currentIndex}
          total={this.props.total}
        />
        <OF.IconButton
          className="ImageButton"
          onClick={this.props.onNext}
          iconProps={{ iconName: 'CaretRightSolid8' }}
        />
      </div>
    )
  }
}

export default DetailText;
