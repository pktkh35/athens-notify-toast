import React from 'react'
import ReactDOM from 'react-dom/client'
import Container from './Container'
import './style/test.scss'
import './style/notify.scss'
import { toast } from './core/toast'

document.addEventListener("keyup", key => {
    const random = Math.floor(Math.random()*4);
    const type = ["info","success","error","warning"][random]
    toast({
        title: "ทดสอบ",
        description: key.code,
        type: type,
        duration: 5000
    });
})

ReactDOM.createRoot(document.getElementById('root')).render(<Container />)