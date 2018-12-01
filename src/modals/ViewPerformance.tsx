/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import '../fabric.css'
import { Performance } from '../models/performance'
import ScaledColor from '../modals/ScaledColor'
import "../Pages/ViewPage.css"
import { MAX_TIME } from '../models/const';

export interface ReceivedProps {
  performance: Performance
  onClose: () => void
}

class ViewPerformance extends React.Component<ReceivedProps, {}> {

  public render() {
    let avgTime = Math.round(this.props.performance.avgTime / 100)
    let bestTime = Math.round(this.props.performance.bestTime / 100)
    let worstTime = Math.round(this.props.performance.worstTime || MAX_TIME / 100)
    let date = new Date(this.props.performance.lastTested).toLocaleDateString()
    return (
      <div className="ModalPage">
          <div className="ContentHeader FilterHeader">
            Performance
          </div>
          <div>
            <div className="ModalBody">
              <div className="FilterList">
                <div>
                  <div className="PerformanceText">Average Time: </div>
                  <div className="InlineBlock">
                    <ScaledColor scale={avgTime} />
                  </div>  
                </div>
                <div>
                  <div className="PerformanceText">Best Time: </div>
                  <div className="InlineBlock">
                    <ScaledColor scale={bestTime} />
                  </div>  
                </div>
                <div>
                  <div className="PerformanceText">Worst Time: </div>
                  <div className="InlineBlock">
                    <ScaledColor scale={worstTime} />
                  </div>  
                </div>
                <div>
                  <div className="PerformanceText">Presentations: </div>
                  <div className="PerformanceText2">
                    {this.props.performance.numPresentations.toString()}
                  </div>  
                </div>
                <div>
                  <div className="PerformanceText">Last Tested: </div>
                  <div className="PerformanceText2">
                    {date}
                  </div>  
                </div>
              </div>
            </div>
            <div className="ContentFooter">
              <OF.IconButton
                  className="ButtonIcon ButtonPrimary FloatRight"
                  onClick={this.props.onClose}
                  iconProps={{ iconName: 'ChromeClose' }}
              />
            </div>
          </div>
      </div>
    );
  }
}

export default ViewPerformance;
