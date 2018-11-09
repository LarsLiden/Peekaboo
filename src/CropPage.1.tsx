import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import ReactCrop from 'react-image-crop'
import { FilePicker } from 'react-file-picker'
import 'react-image-crop/dist/ReactCrop.css'

export interface ReceivedProps {
  onClose: () => void
}

interface ComponentState {
  imageBlob: ArrayBuffer | null
  imageURL: string | null
  file: File | null
  crop: ReactCrop.Crop
}

class CropBackup extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    imageBlob: null,
    imageURL: null,
    file: null,
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
  onChangeFile(file: File) {
    this.setState({file})

    try {
      const imageURL = URL.createObjectURL(file);
      this.setState({imageURL})
    }
    catch (error) {
      console.log(error)
    }
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
        {!this.state.imageURL && 
          <div>
            <OF.Label>Import File</OF.Label>
            <FilePicker
                extensions={['png', 'jpeg', 'jpg']}
                onChange={this.onChangeFile}
                //TODO onError={(error: string) => this.props.setErrorDisplay(ErrorType.Error, error, [], null)}
                maxSize={10}
            >
                <div className="cl-action-creator-file-picker">
                    <OF.PrimaryButton
                        data-testid="model-creator-locate-file-button"
                        className="cl-action-creator-file-button"
                        ariaDescription="Choose a File"
                        text="Choose a File"
                    />
                    <OF.TextField
                        disabled={true}
                        value={this.state.file
                            ? this.state.file.name
                            : ''}
                    />
                </div>
            </FilePicker>
            <img 
              id="canvas" 
              width="300" 
              height="300"
              src={this.state.file ? this.state.file.name : undefined}>
            </img>
          </div>
        }
        {this.state.imageURL &&
          <ReactCrop
            src={this.state.imageURL}
            crop={this.state.crop}
            onChange={this.onCropChange} 
          />
        }
      </div>
    );
  }
}

export default CropBackup;
