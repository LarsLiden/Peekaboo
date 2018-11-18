/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import '../fabric.css'
import "./DetailCounter.css"

export interface ReceivedProps {
  current: number
  total: number
}

class DetailCounter extends React.Component<ReceivedProps, {}> {

  public render() {
      return (
        <div className="DetailCount">
          <div>
            {this.props.total === 0 ? '0' : `${this.props.current+1}`}
          </div>
          <div 
          className="DetailCountDivider">
          </div>
          <div>
            {`${this.props.total}`}
          </div>
        </div>
    );
  }
}

export default DetailCounter;
