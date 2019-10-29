import React from 'react';
import SpeechRecognition from "react-speech-recognition";

class SpeechRecognizer extends React.Component { 
    handleRecordFocus(event) {
        this.props.startListening();
    }

    handleRecordBlur(event) {
        console.log(this.props.transcript)
        this.props.stopListening();
    }
    render() {
        return (
            <div>
            {React.cloneElement(this.props.children, { 
                value : this.props.transcript,
                onFocus : this.handleRecordFocus.bind(this),
                onBlur : this.handleRecordBlur.bind(this)})}
            </div>
        )
    }
}
const options = {
    autoStart: false,
    continuous : false
}
export default SpeechRecognition (options) (SpeechRecognizer);