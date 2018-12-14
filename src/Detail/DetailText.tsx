/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import '../fabric.css'
import './Detail.css'

export interface ReceivedProps {
  title?: string
  className?: string
  text: string
  isLong?: boolean
  showEmpty?: boolean
}

class DetailText extends React.Component<ReceivedProps, {}> {

  public render() {
    if (!this.props.text && !this.props.showEmpty) {
      return null
    }
    const bodyClass = `DetailBody${this.props.isLong ? " DetailLongBody" : ""}`
    return (
      <div className={`DetailText ${this.props.className ? this.props.className : ""}`}>
        {this.props.title &&
          <div className="DetailTitle">
            {this.props.title}
          </div>
        }
        <div className={bodyClass}>
          {this.props.text || "-"}
        </div>
      </div>

    );
  }
}

export default DetailText;
