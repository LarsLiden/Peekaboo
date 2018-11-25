/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import DetailEditText from '../Detail/DetailEditText'
import { generateGUID } from '../Util'
import { Person } from '../models/person'
import { Event } from '../models/models'

export interface ReceivedProps {
  person: Person
  onSave: (events: Event[]) => void
  onCancel: () => void
}

interface ComponentState {
  events: Event[]
}

class EditEvents extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    events: []
  }

  componentDidMount() {
    if (this.state.events.length === 0) {
      // Make a local copy 
      this.setState({
        events: [...this.props.person.events]
      })   
    }
  }

  @OF.autobind
  onClickDelete(event: Event) {
    this.setState({
      events: this.state.events.filter(k => k.id !== event.id)
    }) 
  }

  @OF.autobind
  onClickSave() {
    this.props.onSave(this.state.events)
  }

  @OF.autobind
  onClickAdd() {
    const newEvent: Event = {
      id: generateGUID(),
      date: JSON.stringify(Date()),
      description: "",
      location: ""
    }
    this.setState({
      events: [...this.state.events, newEvent]
    }) 
  }

  @OF.autobind
  onDescriptionChanged(description: string, event: Event) {
    let changed = this.state.events.find(e => e.id === e.id)
    changed!.description = description
  }

  @OF.autobind
  onLocationChanged(location: string, event: Event) {
    let changed = this.state.events.find(e => e.id === e.id)
    changed!.location = location
  }

  @OF.autobind
  onDateChanged(date: string, event: Event) {
    let changed = this.state.events.find(e => e.id === e.id)
    changed!.date = date
  }

  @OF.autobind
  onRenderCell(event: Event, index: number, isScrolling: boolean): JSX.Element {
    return (
      <div className="FilterLine">
        <div className='EditSection EditKeyValueSection'>
          <div className="DetailText DetailEditKeyValue">
            <DetailEditText
              label="Description"
              onChanged={description => this.onDescriptionChanged(description, event)}
              value={event.description}
            />
            <DetailEditText
              label="Location"
              onChanged={location => this.onLocationChanged(location, event)}
              value={event.location}
            />
            <DetailEditText
              label="Date"
              onChanged={date => this.onLocationChanged(date, event)}
              value={event.date}
            />
          </div>
          <OF.IconButton
            className="ButtonIcon ButtonDark FloatRight"
            onClick={() => this.onClickDelete(event)}
            iconProps={{ iconName: 'Delete' }}
        />
        </div>
      </div>
    );
  }

  public render() {
    return (
      <div className="ModalPage">
        <div className="ContentHeader FilterHeader">
          <OF.IconButton
              className="ButtonIcon ButtonPrimary ButtonTopLeft"
              onClick={this.onClickAdd}
              iconProps={{ iconName: 'CircleAddition' }}
          />
          Key Values
        </div>
        <div className="ModalBody">
          <OF.List
            className="FilterList"
            items={this.state.events}
            onRenderCell={this.onRenderCell}
          />
        </div>
        <div
          className="ContentFooter"
        >
          <OF.IconButton
              className="ButtonIcon ButtonPrimary"
              onClick={this.onClickSave}
              iconProps={{ iconName: 'Save' }}
          />
          <OF.IconButton
              className="ButtonIcon ButtonPrimary"
              onClick={this.props.onCancel}
              iconProps={{ iconName: 'Cancel' }}
          />
        </div>
      </div>
    );
  }
}

export default EditEvents;
