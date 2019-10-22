import React, {useState} from 'react';
import { Alert } from 'react-bootstrap'

function AlertDismissible({ message, type}) {
    const [show, setShow] = useState(true);
    if (show) {
      return (
        <Alert variant={type} onClose={() => setShow(false)} dismissible>
          {message}
        </Alert>
      );
    }
    return (
        <div></div>
    )
  }
  export default AlertDismissible;