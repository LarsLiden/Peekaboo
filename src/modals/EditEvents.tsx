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

const DayPickerStrings: OF.IDatePickerStrings = {
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

  shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

  shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

  goToToday: 'Go to today',
  prevMonthAriaLabel: 'Go to previous month',
  nextMonthAriaLabel: 'Go to next month',
  prevYearAriaLabel: 'Go to previous year',
  nextYearAriaLabel: 'Go to next year',
  closeButtonAriaLabel: 'Close date picker',

  isRequiredErrorMessage: 'Start date is required.',

  invalidInputErrorMessage: 'Invalid date format.'
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
      events: this.state.events.filter(k => k.eventId !== event.eventId)
    }) 
  }

  @OF.autobind
  onClickSave() {
    this.props.onSave(this.state.events)
  }

  @OF.autobind
  onClickAdd() {
    const newEvent: Event = {
      eventId: generateGUID(),
      date: new Date().toJSON(),
      description: "",
      location: ""
    }
    this.setState({
      events: [...this.state.events, newEvent]
    }) 
  }

  @OF.autobind
  onDescriptionChanged(description: string, event: Event) {
    let changed = this.state.events.find(e => e.eventId === event.eventId)
    changed!.description = description
  }

  @OF.autobind
  onLocationChanged(location: string, event: Event) {
    let changed = this.state.events.find(e => e.eventId === event.eventId)
    changed!.location = location
  }

  @OF.autobind
  onDateChanged(date: Date | null | undefined, event: Event) {
    let changed = this.state.events.find(e => e.eventId === event.eventId)
    changed!.date = date!.toJSON()
  }

  @OF.autobind
  onFormatDate(date: Date): string {
      return `${date.getMonth()}/${date.getDate() + 1}/${date.getFullYear()}`
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
            <OF.DatePicker
              label="Date"
              isRequired={false}
              allowTextInput={true}
              ariaLabel="Date"
              firstDayOfWeek={OF.DayOfWeek.Sunday}
              strings={DayPickerStrings}
              value={event.date ? new Date(event.date) : new Date()}
              onSelectDate={date => this.onDateChanged(date, event)}
              formatDate={this.onFormatDate}
             //TODO  parseDateFromString={this._onParseDateFromString}
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
        <div className="HeaderHolder">
          <div className="HeaderContent">
            <OF.IconButton
                className="ButtonIcon ButtonPrimary ButtonTopLeft"
                onClick={this.onClickAdd}
                iconProps={{ iconName: 'CircleAddition' }}
            />
            Key Values
          </div>
        </div>
        <div className="ModalBodyHolder">
          <div className="ModalBodyContent">
            <OF.List
              items={this.state.events}
              onRenderCell={this.onRenderCell}
            />
          </div>
        </div>
        <div className="FooterHolder"> 
          <div className="FooterContent">
            <OF.IconButton
                className="ButtonIcon ButtonPrimary"
                onClick={this.onClickSave}
                iconProps={{ iconName: 'Save' }}
            />
            <OF.IconButton
                className="ButtonIcon ButtonPrimary"
                onClick={this.props.onCancel}
                iconProps={{ iconName: 'ChromeClose' }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default EditEvents;
