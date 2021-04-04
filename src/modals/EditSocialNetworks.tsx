/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import DetailEditText from '../Detail/DetailEditText'
import { Person } from '../models/person'
import { SocialNet, SocialNetType, SocialNetSearchIcon, SocialNetSearch } from '../models/models'
import { generateGUID } from '../Util'
import { autobind } from 'core-decorators'

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

  componentDidUpdate(prevProps: ReceivedProps) {
    if (prevProps.person !== this.props.person || this.state.socialNets.length === 0) {

      let socialNets: SocialNet[] = []
      Object.keys(SocialNetType).forEach(key => {
        let snt = SocialNetType[key]
        let exists = this.props.person.socialNets.find(sn => sn.netType === snt)
        if (exists) {
          socialNets.push({...exists})
        }
        else {
          socialNets.push({
            socialNetId: generateGUID(),
            URL: "",
            profileID: "",
            netType: snt
          })
        }
      })
      // Make a local copy 
      this.setState({
        socialNets
      })   
    }
  }

  @autobind
  onClickDelete(socialNetType: SocialNetType) {
    this.setState({
      socialNets: this.state.socialNets.filter(k => k.netType !== socialNetType)
    }) 
  }

  @autobind
  onClickSave() {
    const socialNets = this.state.socialNets.filter(sn => sn.URL !== "")
    this.props.onSave(socialNets)
  }

  @autobind
  onClickAdd() {
    const newSocialNet: SocialNet = {
      socialNetId: generateGUID(),
      URL: "",
      profileID: "",
      netType: SocialNetType.LINKEDIN
    }
    this.setState({
      socialNets: [newSocialNet, ...this.state.socialNets]
    }) 
  }

  @autobind
  onURLChanged(url: string | undefined, socialNetType: SocialNetType) {
    if (url) {
      let changed = this.state.socialNets.find(r => r.netType === socialNetType)
      changed!.URL = url
    }
  }

  @autobind 
  onTypeChange(option: OF.IDropdownOption, socialNet: SocialNet) {
    let changed = this.state.socialNets.find(r => r.socialNetId === socialNet.socialNetId)
    changed!.netType = SocialNetType[option.text]
  }

  @autobind
  onOpenLink(e: any, socialNetType: SocialNetType) {
    e.preventDefault()
    const url = `${SocialNetSearch[socialNetType]}${this.props.person.firstName}%20${this.props.person.lastName}`
    window.open(url, "_blank", socialNetType)
  }

  @autobind
  onRenderCell(socialNetType: SocialNetType): JSX.Element {
    let socialNet = this.state.socialNets.find(r => r.netType === socialNetType)
    let url = socialNet ? socialNet.URL : null
    return (
      <div className="SectionBorder">
        <div>
          <div className='EditDropdownSection'>
            <OF.Image
                key={socialNetType}
                className="SocialNetButton"
                onClick={(e) => this.onOpenLink(e, socialNetType)}
                src={SocialNetSearchIcon[socialNetType]}
                width={40}
                height={40}
            />
            <OF.IconButton
              className="ButtonIcon ButtonDark FloatRight"
              onClick={() => this.onClickDelete(socialNetType)}
              iconProps={{ iconName: 'Delete' }}
            />
          </div>
          <div>
            <DetailEditText
              label="URL"
              onChanged={key => this.onURLChanged(key, socialNetType)}
              value={url || ""}
            />
          </div>
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
            Social Networks
          </div>
        </div>
        <div className="ModalBodyHolder">
          <div className="ModalBodyContent">
            {
              Object.keys(SocialNetType).map(key => { 
                  return (
                    this.onRenderCell(SocialNetType[key])
                  )
                }
            )}
          </div>
        </div>
        <div className="FooterHolder"> 
          <div className="FooterContent">
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
      </div>
    );
  }
}

export default EditSocialNetworks;
