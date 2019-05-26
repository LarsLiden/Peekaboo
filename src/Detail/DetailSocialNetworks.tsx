/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { SocialNet, SocialNetIcon, SocialNetSearchIcon, SocialNetType, SocialNetSearch } from '../models/models'
import { generateGUID } from '../Util';
import { Person } from '../models/person'
import { Page } from '../App'
import { SubPage } from '../Pages/EditPage';
import "./DetailEvents.css"
import '../fabric.css'

export interface ReceivedProps {
  person: Person
  inEdit?: boolean
  onSetPage: (page: Page, backpage: Page | null, subPage: SubPage | null) => void
}

interface ComponentState {
  socialNets: SocialNet[]
}

class DetailSocialNetworks extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    socialNets: []
  }

  @OF.autobind
  onOpenLink(e: any, link: string, netType: SocialNetType) {
    e.preventDefault()
    if (!link) {
      const searchUrl = `${SocialNetSearch[netType]}${this.props.person.firstName}%20${this.props.person.lastName}`
      window.open(searchUrl, "_blank", "new")  
      this.props.onSetPage(Page.EDIT, Page.VIEW, SubPage.SOCIALNETWORKS)
    }
    else {
      window.open(link, "_blank", "new")
    }
  }

  componentDidUpdate(prevProps: ReceivedProps) {
    if (this.props.person !== prevProps.person || this.state.socialNets.length === 0) {
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

  public render() {
    if (this.state.socialNets.length === 0) {
      return null
    }
    return (
      <div className={`DetailText ${this.props.inEdit ? 'DetailEdit'  : ''}`}>
        <div className="DetailBody DetailLongBody">
          {this.state.socialNets.map(sn => {
            return (
              <OF.Image
                key={sn.netType}
                className="QuizImageHolder"
                onClick={(e) => this.onOpenLink(e, sn.URL, sn.netType)}
                src={sn.URL ? SocialNetIcon[sn.netType] : SocialNetSearchIcon[sn.netType]}
                width={40}
                height={40}
              />
            )
            })
          }
        </div>
      </div>
    )
  }
}

export default DetailSocialNetworks;
