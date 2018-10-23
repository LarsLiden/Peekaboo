import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { Tag, Filter } from './models/models'

export interface ReceivedProps {
  tags: Tag[]
  filter: Filter
  onClose: () => void
  onSetRequireTag: (tagName: string, value: boolean) => void
  onSetBlockTag: (tagName: string, value: boolean) => void
}

interface ComponentState {
}

class FilterPage extends React.Component<ReceivedProps, ComponentState> {

  componentDidMount() {
    
  }

  @OF.autobind
  onClickClose() {
    this.props.onClose()
  }

  @OF.autobind
  private onCheckboxRequireChange(isChecked: boolean = false, tag: Tag) {
    this.props.onSetRequireTag(tag.name, isChecked)
  }

  @OF.autobind
  private onCheckboxBlockChange(isChecked: boolean = false, tag: Tag) {
    this.props.onSetBlockTag(tag.name, isChecked)
  }

  @OF.autobind
  private onRenderCell(item: Tag, index: number, isScrolling: boolean): JSX.Element {
    return (
      <div className="FilterLine">
        <OF.Checkbox 
          className="FilterCheckbox"
          onChange={(ev, isChecked) => this.onCheckboxRequireChange(isChecked, item)}
          checked={this.props.filter.required.indexOf(item.name) > -1}
        />
        <div className="FilterName">{item.name}</div>
        <div className="FilterNumber">{item.count}</div>
        <OF.Checkbox 
          className="FilterCheckbox"
          onChange={(ev, isChecked) => this.onCheckboxBlockChange(isChecked, item)} 
          checked={this.props.filter.blocked.indexOf(item.name) > -1}
        /> 
      </div>
    );
  }
  public render() {
  
    return (
      <div className="FilterPage">
        <OF.List
          className="FilterList"
          items={this.props.tags}
          onRenderCell={this.onRenderCell}
        />
        <OF.DefaultButton
            className="QuizButton"
            onClick={this.onClickClose}
            text="Close"
        />  
      </div>
    );
  }
}

export default FilterPage;
