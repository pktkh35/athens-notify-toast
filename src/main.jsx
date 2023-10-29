import React from 'react'
import ReactDOM from 'react-dom/client'
import Container from './Container'
import './style/test.scss'
import './style/notify.scss'
import { toast } from './core/toast'

setTimeout(() => {
    toast({
        title: "ทดสอบ",
        description: "ทดสอบ <br>test<br>",
        type: "success",
        duration: 5000
    });
    toast({
        title: "ทดสอบ",
        description: "ทดสอบ <br>test<br>",
        type: "error",
        duration: 5000
    });
    toast({
        title: "ทดสอบ",
        description: "ทดสอบ <br>test<br>",
        type: "warning",
        duration: 5000
    });
    toast({
        title: "ทดสอบ",
        description: "ทดสอบ <br>test<br>",
        type: "info",
        duration: 5000
    });
}, 500);

ReactDOM.createRoot(document.getElementById('root')).render(<Container />)