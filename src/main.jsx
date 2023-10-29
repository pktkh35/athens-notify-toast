import React from 'react'
import ReactDOM from 'react-dom/client'
import Container from './Container'
import './style/test.scss'
import './style/notify.scss'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { toast } from './core/toast'

setTimeout(() => {
    toast({
        title: "ทดสอบ",
        description: "ทดสอบ <br>test<br>",
        type: "success",
        duration: 50000
    });
    toast({
        title: "ทดสอบ",
        description: "ทดสอบ <br>test<br>",
        type: "error",
        duration: 50000
    });
    toast({
        title: "ทดสอบ",
        description: "ทดสอบ <br>test<br>",
        type: "warning",
        duration: 50000
    });
    toast({
        title: "ทดสอบ",
        description: "ทดสอบ <br>test<br>",
        type: "info",
        duration: 50000
    });
}, 500);

ReactDOM.createRoot(document.getElementById('root')).render(<Provider store={store}>
    <Container />
</Provider>)