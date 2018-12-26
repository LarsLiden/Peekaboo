/**
 * Copyright (c) Lars Liden. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import { PHOTO_HEIGHT, PHOTO_WIDTH, setStatePromise } from '../Util'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export interface ReceivedProps {
  originalImageURL: string
  onSave: (imageData: string) => void
  onClose: () => void
}

interface ComponentState {
  imageURL: string | null
  imageBlob: ArrayBuffer | null
  crop: ReactCrop.Crop
  cropped: boolean
  rotating: boolean
  isCalloutVisible: boolean
}

class CropPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    imageURL: null,
    imageBlob: null,
    crop: {aspect: PHOTO_WIDTH / PHOTO_HEIGHT, x: 0, y: 0},
    cropped: false,
    rotating: false,
    isCalloutVisible: false
  }

  private _saveButtonElement = React.createRef<any>();

  componentDidMount() {
    this.setState({imageURL: this.props.originalImageURL})
  }

  componentWillReceiveProps(newProps: ReceivedProps) {
    this.setState({imageURL: newProps.originalImageURL})
  }

  async onRotate(clockwise: boolean) {
  
    await setStatePromise(this, {rotating: true})
    this.forceUpdate()
    let canvas = document.createElement('canvas')

    const image = new Image() 
    image.src = this.state.imageURL!

    canvas.width = image.height
    canvas.height = image.width

    const ctx = canvas.getContext("2d")

    const rotation = clockwise ? 90 : 270

    ctx!.rotate(rotation * Math.PI / 180)

    if (rotation === 90) {
        ctx!.translate(0, -canvas.width)
        ctx!.drawImage(image, 0, 0, canvas.height, canvas.width)
    }   
    else if (rotation === 270) {
        ctx!.translate(-canvas.height, 0);
        ctx!.drawImage(image, 0, 0, canvas.height, canvas.width)
    }

    // Use time out so page has a change to render "rotating" message
    window.setTimeout(() => {
      const imageURL = canvas.toDataURL()

      this.setState({
        rotating: false,
        crop: {aspect: PHOTO_WIDTH / PHOTO_HEIGHT, x: 0, y: 0},
        imageURL
      })
    }, 0)

  }

  @OF.autobind
  onSave() {
  
    if (!this.state.cropped) {
      this.setState({isCalloutVisible: true})
      return
    }

    const image = new Image() 
    image.src = this.state.imageURL!

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
  }

  @OF.autobind
  onCropChange(crop: ReactCrop.Crop) {
    this.setState({ 
      crop, 
      cropped: true,
      isCalloutVisible: false });  
  }

  @OF.autobind
  onClickClose() {
    this.props.onClose()
  }

  public render() {
  
    return (
      <div className="FilterPage">
        {this.state.imageURL &&
          <div>
            <div className="ModalBodyHolder">
              <div className="ModalBodyContent ModalBodyHeaderHolderTall">
                <ReactCrop
                  src={this.state.imageURL}
                  crop={this.state.crop}
                  onChange={this.onCropChange} 
                />
              </div>
            </div>
            <div className="FooterHolder"> 
              <div className="FooterContent">
                  <OF.IconButton
                      className="ButtonIcon ButtonPrimary FloatLeft"
                      onClick={this.onSave}
                      iconProps={{ iconName: 'Save' }}
                      ref={this._saveButtonElement}
                  />
                  {this.state.isCalloutVisible &&
                    <div
                      className="CropCallout"
                      role={'alertdialog'}
                      onClick={() => this.setState({isCalloutVisible: false})}
                    >
                      Drag to select Crop area first
                      <OF.IconButton
                        className="ButtonIcon ButtonPrimary FloatRight"
                        onClick={() => this.setState({isCalloutVisible: false})}
                        iconProps={{ iconName: 'ChromeClose' }}
                      />
                    </div>
                  }
                  {this.state.rotating ?
                    <div className="CropCallout">Rotating...</div>
                  :
                    <div className="InlineBlock">
                      <OF.IconButton
                          className="ButtonIcon ButtonPrimary"
                          onClick={async () => {await setStatePromise(this, {rotating: true})
                          this.onRotate(false)}}
                          iconProps={{ iconName: 'Undo' }}
                      />
                      <OF.IconButton
                          className="ButtonIcon ButtonPrimary"
                          onClick={() => this.onRotate(true)}
                          iconProps={{ iconName: 'Redo' }}
                      />
                    </div>
                  }
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
