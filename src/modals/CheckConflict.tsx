/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import * as Util from '../Util'
import { Person } from '../models/person'
import { User } from '../models/models'
import { autobind } from 'core-decorators'

export interface ReceivedProps {
  user: User,
  conflicts: Person[]
  onConflict: (person: Person) => void,
  onNoConflict: () => void
}

interface ComponentState { 
  curConflict: Person | null
  remainingConflicts: Person[]
}

class CheckConflict extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    curConflict: null,
    remainingConflicts: []
  }

  componentDidMount() {
    let remainingConflicts = [...this.props.conflicts]
    let curConflict = remainingConflicts.pop()
    this.setState({
      curConflict: curConflict!,
      remainingConflicts
    })
  }

  @autobind
  public onNoConflict() {
    // Remove from conflict list
    let remainingConflicts = [...this.state.remainingConflicts]
    let curConflict = remainingConflicts.pop()
    if (!curConflict) {
      this.props.onNoConflict()
    }
    else {
      this.setState({
        curConflict: curConflict!,
        remainingConflicts
      })
    }
  }

  public render() {
    if (!this.state.curConflict) {
      return null
    }

    const photoBlobName = Util.baseBlob(this.props.user) 
    + Util.getPhotoBlobName(this.state.curConflict, this.state.curConflict.photoFilenames[0])
     
    return (
      <div className="ModalPage">
        <div className="ConfirmTitle">
          Potential Conflict
        </div>
        <div className="ConfirmSubtitle">
          Is this the same person?
        </div>
        <OF.Image
          className="ConfirmImageHolder"
          src={photoBlobName}
          width={100}
          height={100}
        />
        <div className='ExpandedName'>
          {this.state.curConflict.expandedName()}
        </div>
        <div className="FooterHolder"> 
          <div className="FooterContent"> 
            <OF.IconButton
                className="ButtonIcon ButtonPrimary FloatLeft"
                onClick={() => this.props.onConflict(this.state.curConflict!)}
                iconProps={{ iconName: 'LikeSolid' }}
            />
            {this.props.onConflict &&
              <OF.IconButton
                  className="ButtonIcon ButtonPrimary FloatRight"
                  onClick={this.onNoConflict}
                  iconProps={{ iconName: 'DislikeSolid' }}
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default CheckConflict;
