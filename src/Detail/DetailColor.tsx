/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import '../fabric.css'
import './Detail.css'

export interface ReceivedProps {
  value: number
}

class DetailColor extends React.Component<ReceivedProps, {}> {

  backgroundColor(color: number): string {
    let r: number
    let g: number

    if (color <= 50) {
        r = 255;
    }
    else {
        r = (1 - (color - 50) / 50) * 255
    }

    if (color > 50)
    {
        g = 255
    }
    else
    {
        g = (color / 50) * 255
    }

    return `rgb(${r}, ${g}, 0)`
  }

  public render() {
    const overrideStyles = OF.mergeStyles({
      backgroundColor: this.backgroundColor(this.props.value * 100),
      color: "#ffffff",
      fontSize: "20px",
      borderRadius: "5px",
      width: "145px",
      height: "5px",
      margin: "0px",
      float: "left",
    })

  return (
    <div
      className={overrideStyles}
    />
    )
  }
}

export default DetailColor;
