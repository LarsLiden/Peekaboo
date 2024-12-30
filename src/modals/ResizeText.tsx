/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import '../fabric.css'

export interface ReceivedProps {
  text: string;
  maxWidth: number;
}

const fontWidth = 11
const baseFontSize = 20

class ResizeText extends React.Component<ReceivedProps, {}> {

  getStyle(): React.CSSProperties {
    const maxChars = this.props.maxWidth / fontWidth
    const extraChars = this.props.text.length - maxChars
    const fontSize = (extraChars > 0)
      ? baseFontSize - extraChars
      : baseFontSize
    if (fontSize < 15) {
      return {
        fontSize: '15px',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        marginBottom: '18px'
      };
    }
    else {
      return {fontSize: `${fontSize}px`};
    }
  }

  public render() {

    return (
      <div className="DetailName" style={this.getStyle()}>
        {this.props.text}
      </div>
    );
  }
}

export default ResizeText;
