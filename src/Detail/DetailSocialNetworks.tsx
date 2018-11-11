/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import { SocialNet } from '../models/models'
import * as OF from 'office-ui-fabric-react'
import "./DetailEvents.css"
import '../fabric.css'

export interface ReceivedProps {
  socialNets: SocialNet[]
}

interface ComponentState { 
  inEditMode: boolean
}


const columns: OF.IColumn[] = [
  {
    key: 'netType',
    name: 'netType',
    fieldName: 'netType',
    minWidth: 50,
    maxWidth: 50,
    //onColumnClick: this._onColumnClick,
    onRender: (item: SocialNet) => {
      return <div className="TableCell">
        <OF.Link href={item.URL}>{item.netType.toString()}</OF.Link>
      </div>
    }
  }
]

class DetailSocialNetworks extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    inEditMode: false
  }

  public render() {
    if (this.props.socialNets.length === 0) {
      return null
    }
      return (
        <div className="DetailText">
          <div className="DetailTitle">
            SOCIAL NETWORK
          </div>
          <div className="DetailLongBody">
            <OF.DetailsList
                isHeaderVisible={false}
                compact={true}
                selectionMode={OF.SelectionMode.none}
                className="DetailEventList"
                columns={columns}
                items={this.props.socialNets}
            />
          </div>
        </div>
    )
  }
}

export default DetailSocialNetworks;
