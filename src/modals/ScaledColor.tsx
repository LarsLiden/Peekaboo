/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import '../fabric.css'

export interface ReceivedProps {
  // Between 0 - 100
  scale: number
}

class ScaledColor extends React.Component<ReceivedProps, {}> {

  fontColor(): string {
      const color = ((this.props.scale - 25) / 100) * 255
      return `rgb(${color}, ${color}, ${color})`
  }

  backgroundColor(): string {
      let scale = (100 - this.props.scale)
      let r: number
      let g: number

      if (scale <= 50) {
          r = 255;
      }
      else {
          r = (1 - (scale - 50) / 50) * 255
      }

      if (scale > 50) {
          g = 255
      }
      else {
          g = (scale / 50) * 255
      }

      return `rgb(${r}, ${g}, 0)`
  }

  public render() {
    const overrideStyles = OF.mergeStyles({
      backgroundColor: this.backgroundColor(),
      color: this.fontColor(),
      width: "50px",
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: "5px",
      fontSize: "20px",
      marginTop: "0px",
      height: "30px",
      borderRadius: "5px"
    })

    return (
        <div className={overrideStyles} >
          {this.props.scale}
        </div>
    )
  }
}

export default ScaledColor;
