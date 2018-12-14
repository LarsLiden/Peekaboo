/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { PHOTO_HEIGHT, PHOTO_WIDTH } from '../Util'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export interface ReceivedProps {
  imageURL: string
  onSave: (imageData: string) => void
  onClose: () => void
}

interface ComponentState {
  imageBlob: ArrayBuffer | null
  crop: ReactCrop.Crop
}

class CropPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    imageBlob: null,
    crop: {aspect: PHOTO_WIDTH / PHOTO_HEIGHT, x: 0, y: 0}
  }

  @OF.autobind
  onSave() {
  
    const image = new Image() 
    image.src = this.props.imageURL

    const canvas = document.createElement('canvas')
    canvas.width = PHOTO_WIDTH
    canvas.height = PHOTO_HEIGHT
    const ctx = canvas.getContext('2d')
  
    ctx!.drawImage(
      image,
      (this.state.crop.x / 100) * image.width,          // Top left X Source
      (this.state.crop.y / 100) * image.height,         // Top left Y Source
      ((this.state.crop.width!) / 100) * image.width,   // Width
      ((this.state.crop.height!) / 100) * image.height, // Height
      0,                                                // Top left X Destination
      0,                                                // Top left Y Destination
      PHOTO_WIDTH,                                      // Width Destination
      PHOTO_HEIGHT                                      // Height Destination
    )

    const data = canvas.toDataURL()
    this.props.onSave(data)
    /*LRAS
    canvas.toBlob(blob => {
      this.props.onSave(blob!)
    })*/
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
              keepSelection={true}
            />
            <div className="FooterHolder"> 
              <div className="FooterContent">
                  <OF.IconButton
                      className="ButtonIcon ButtonPrimary FloatLeft"
                      onClick={this.onSave}
                      iconProps={{ iconName: 'Save' }}
                  />
                  <OF.IconButton
                      className="ButtonIcon ButtonPrimary FloatRight"
                      onClick={this.props.onClose}
                      iconProps={{ iconName: 'ChromeClose' }}
                  />
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default CropPage;
