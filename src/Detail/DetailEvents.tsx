/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import { Event } from '../models/models'
import { printDate } from '../Util'
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
          <div className={`DetailTitle`}>
            Events
          </div>
          <div className="DetailBody">
            {this.props.events.map(event => {
                let dateString = event.date ? printDate(new Date(event.date)) : ""
                return (
                  <div className="DetailLongBody" key={event.description}>
                    <div className="DetailEventDate">
                      <div className="DetailBody NoPadding">
                        {dateString}
                      </div>
                    </div>
                    <div className="DetailEventBody">
                      <div className="DetailBody NoPadding">
                        {event.location}
                      </div>
                      <div className="DetailBody NoPadding">
                        {event.description}
                      </div>
                    </div>
                  </div>
                )}
            )}
          </div>
        </div>
    )
  }
}

export default DetailEvents;
