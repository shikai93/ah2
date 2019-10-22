import React from 'react';
import AlertDismissible from './dismissableMessage.js'
class Messages extends React.Component { 
    constructor(props, context) {
        super(props, context)
        this.state = {
            messages : []
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        var prevMessages = prevState.messages
        var shouldUpdate = false
        for (var i=0; i < nextProps.messages.length; i++) {
            var msg = nextProps.messages[i]
            if (!prevMessages.includes(msg)) {
                prevMessages.push(msg)
                shouldUpdate = true
            }
        }
        if (!shouldUpdate) {
            return null
        } else {
            prevState.messages = prevMessages
            return prevState
        }
    }
    
    renderMessages = () => {
        if (! Array.isArray(this.state.messages)) {
            return
        }
        var messages = []
        for (var i=0; i < this.state.messages.length; i++) {
            var msg = this.state.messages[i]
            messages.push(
                <AlertDismissible key={i} message={msg.message} type={msg.type} />
            )
        }
        return messages 
    }
    render() {
        return (
            <div>
                {this.renderMessages()}
            </div>
        )
    }
}
export default Messages