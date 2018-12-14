/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import './fabric.css'
import './Detail.css'

export interface ReceivedProps {
  title: string
  text: string
  isLong?: boolean
}

interface ComponentState { 
  inEditMode: boolean
}

export class Color {
  public r: number;
  public g: number;
  public b: number;
}

class DetailFamiliarity extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    inEditMode: false
  }

  public GetFamiliarityColor(familiarity: number): Color
  {
      let r: number
      let g: number

      if (familiarity <= 50) {
          r = 255;
      }
      else {
          r = (255*(1-(familiarity-50.0)/50))
      }

      if (familiarity > 50) {
          g = 255
      }
      else {
          g = (255*(familiarity/50))
      }

      return {r, g, b: 0}
  }

  public render() {

      const bodyClass = this.props.isLong ? "DetailLongBody" : "DetailBody"
      return (
        <div className="DetailText">
          <div className="DetailTitle">
            {this.props.title}
          </div>
          <div className={bodyClass}>
            {this.props.text || "-"}
          </div>
        </div>

    );
  }
}

export default DetailFamiliarity;
