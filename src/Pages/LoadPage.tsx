import * as React from 'react';
import * as OF from 'office-ui-fabric-react'
import 'react-image-crop/dist/ReactCrop.css'

const timerInterval = 120

export interface ReceivedProps {
  letter: string
  count: number
}

interface ComponentState { 
  displayCount: number,
  timerId: NodeJS.Timer | null,
}

class LoadPage extends React.Component<ReceivedProps, ComponentState> {

  state: ComponentState = {
    displayCount: 0,
    timerId: null
  }

  componentWillReceiveProps(newProps: ReceivedProps) {
    // Jump forward if data arriving faster than display
    if (this.props.count !== newProps.count) {
      this.setState({displayCount: this.props.count})
    }
  }

  componentDidMount() {
   
    const timerId = setInterval(()=> 
    {
      if (this.state.displayCount < this.props.count) {
          this.setState({
            displayCount: this.state.displayCount + 1
        })
      }
    }, timerInterval)

    this.setState({timerId})
  }

  componentWillUnmount() {
    this.clearTimer()
  }

  clearTimer() {
    if (this.state.timerId != null) {
      clearInterval(this.state.timerId)
      this.setState({
        timerId: null
      })
    }
  }

  public render() {
  
    return (
      <div className="FilterPage">
        <div>
          {this.state.displayCount === 0 
          ?
            <OF.Label className='LoadTitle'>Finding your people...</OF.Label>
          :
            <div>
              <OF.Label className='LoadTitle'>Loading</OF.Label>
              <OF.Label
                className='LoadCount'
              >
                {this.state.displayCount}
              </OF.Label>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default LoadPage;
