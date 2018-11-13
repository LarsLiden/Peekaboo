/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export interface ReceivedProps {
  imageURL: string
  onSave: (blob: Blob) => void
  onClose: () => void
}

interface ComponentState {
  imageBlob: ArrayBuffer | null
  crop: ReactCrop.Crop
}

class CropPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    imageBlob: null,
    crop: {aspect: 1/1, x:0, y:0}
  }

  @OF.autobind
  onSave() {
  
    const image = document.createElement('img');

    const canvas = document.createElement('canvas');
    canvas.width = this.state.crop.width!;
    canvas.height = this.state.crop.height!;
    const ctx = canvas.getContext('2d');
  
    ctx!.drawImage(
      image,
      this.state.crop.x,
      this.state.crop.y,
      this.state.crop.width!,
      this.state.crop.height!,
      0,
      0,
      this.state.crop.width!,
      this.state.crop.height!
    )


    canvas.toBlob(blob =>{
      this.props.onSave(blob!)
    })
  }

  @OF.autobind
  onCropChange(crop: ReactCrop.Crop) {
    this.setState({ crop });  
  }

  @OF.autobind
  onClickClose() {
    this.props.onClose()
  }

  public render() {
  
    return (
      <div className="FilterPage">
        {this.props.imageURL &&
          <div>
          <ReactCrop
            src={this.props.imageURL}
            crop={this.state.crop}
            onChange={this.onCropChange} 
          />
          <div
            className="ContentFooter">
              <OF.IconButton
                  className="ButtonIcon ButtonPrimary"
                  onClick={this.onSave}
                  iconProps={{ iconName: 'Save' }}
              />
              <OF.IconButton
                  className="ButtonIcon ButtonPrimary"
                  onClick={this.props.onClose}
                  iconProps={{ iconName: 'Cancel' }}
              />
            </div>
          </div>
        }
      </div>
    );
  }
}

export default CropPage;
