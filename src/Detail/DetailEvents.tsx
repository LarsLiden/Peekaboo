/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import { Event } from '../models/models'
import { printDate } from '../Util'
import DetailText from './DetailText'
import "./DetailEvents.css"
import '../fabric.css'

export interface ReceivedProps {
  events: Event[]
  inEdit?: boolean
}

class DetailEvents extends React.Component<ReceivedProps, {}> {

  public render() {
      if (!this.props.inEdit && this.props.events.length === 0) {
        return null
      }
      return (
        <div className={`DetailText ${this.props.inEdit ? 'DetailEdit'  : ''}`}>
          <div className={`DetailTitle ${this.props.inEdit ? 'DetailEditTitle'  : ''}`}>
            Events
          </div>
          {this.props.events.map(event => {
              let dateString = event.date ? printDate(new Date(event.date)) : ""
              return (
                <div className="DetailLongBody" key={event.description}>
                  <div className="DetailEventDate">
                    <DetailText text={dateString}/>
                  </div>
                  <div className="DetailEventBody">
                    <DetailText text={event.location} />
                    <DetailText text={event.description}/>
                  </div>
                </div>
              )}
          )}
        </div>
    )
  }
}

export default DetailEvents;
