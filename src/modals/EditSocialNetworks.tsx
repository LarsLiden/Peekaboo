/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import DetailEditText from '../Detail/DetailEditText'
import { Person } from '../models/person'
import { SocialNet, SocialNetType } from '../models/models'
import { generateGUID } from '../Util';

export interface ReceivedProps {
  person: Person
  onSave: (socialNets: SocialNet[]) => void
  onCancel: () => void
}

interface ComponentState {
  socialNets: SocialNet[]
  types: { key: string; text: any; }[]
}

class EditSocialNetworks extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    socialNets: [],
    types: Object.keys(SocialNetType).map(e => {
      return {key: SocialNetType[e], text: SocialNetType[e]}
    }),
  }

  componentDidMount() {
    if (this.state.socialNets.length === 0) {
      // Make a local copy 
      this.setState({
        socialNets: [...this.props.person.socialNets]
      })   
    }
  }

  @OF.autobind
  onClickDelete(socialNet: SocialNet) {
    this.setState({
      socialNets: this.state.socialNets.filter(k => k.id !== socialNet.id)
    }) 
  }

  @OF.autobind
  onClickSave() {
    this.props.onSave(this.state.socialNets)
  }

  @OF.autobind
  onClickAdd() {
    const newSocialNet: SocialNet = {
      id: generateGUID(),
      URL: "",
      profileID: "",
      netType: SocialNetType.LINKEDIN
    }
    this.setState({
      socialNets: [...this.state.socialNets, newSocialNet]
    }) 
  }

  @OF.autobind
  onURLChanged(url: string, socialNet: SocialNet) {
    let changed = this.state.socialNets.find(r => r.id === socialNet.id)
    changed!.URL = url
  }

  @OF.autobind 
  onTypeChange(option: OF.IDropdownOption, socialNet: SocialNet) {
    let changed = this.state.socialNets.find(r => r.id === socialNet.id)
    changed!.netType = SocialNetType[option.text]
  }

  @OF.autobind
  onRenderCell(socialNet: SocialNet, index: number, isScrolling: boolean): JSX.Element {
    return (
      <div className="FilterLine">
        <div className='EditSection'>
          <div className='EditDropdownSection'>
            <OF.Dropdown
              className="EditDropdown"
              defaultSelectedKey={socialNet.netType}
              options={this.state.types}
              onChanged={(obj) => this.onTypeChange(obj, socialNet)}
            />
            <OF.IconButton
              className="ButtonIcon ButtonDark FloatRight"
              onClick={() => this.onClickDelete(socialNet)}
              iconProps={{ iconName: 'Delete' }}
            />
          </div>
          <div>
            <DetailEditText
              label="URL"
              onChanged={key => this.onURLChanged(key, socialNet)}
              value={socialNet.URL}
            />
          </div>
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
            items={this.state.socialNets}
            onRenderCell={this.onRenderCell}
          />
        </div>
        <div
          className="ContentFooter"
        >
          <OF.IconButton
              className="ButtonIcon ButtonPrimary FloatLeft"
              onClick={this.onClickSave}
              iconProps={{ iconName: 'Save' }}
          />
          <OF.IconButton
              className="ButtonIcon ButtonPrimary FloatRight"
              onClick={this.props.onCancel}
              iconProps={{ iconName: 'ChromeClose' }}
          />
        </div>
      </div>
    );
  }
}

export default EditSocialNetworks;