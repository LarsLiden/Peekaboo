import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export interface ReceivedProps {
  imageURL: string
  onSave: () => void
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

  /**
   * @param {File} image - Image File Object
   * @param {Object} pixelCrop - pixelCrop Object from the 2nd argument of onChange or onComplete
   * @param {String} fileName - Name of the returned file in Promise
   */
  getCroppedImg(image: HTMLImageElement, pixelCrop: ReactCrop.PixelCrop, fileName: string) {
  
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');
  
    ctx!.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )
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
            className="ViewFooter">
              <OF.IconButton
                  className="ImageButton"
                  onClick={this.props.onSave}
                  iconProps={{ iconName: 'Save' }}
              />
              <OF.IconButton
                  className="ImageButton"
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
