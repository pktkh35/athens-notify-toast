import React from 'react'
import ReactDOM from 'react-dom/client'
import Container from './Container'
import './style/test.scss'
import './style/notify.scss'
// import { toast } from './core/toast'

// setInterval(() => {
//     const cfg = {
//         type: 'error',
//         description: "ไม่พบคำสั่ง - /asd",
//         title: "System",
//         duration: 5000,
//     }

//     toast({
//         icon: cfg.icon ? <span dangerouslySetInnerHTML={{ __html: cfg.icon, }} /> : false,
//         title: cfg.title || cfg.description,
//         description: cfg.description,
//         duration: cfg.duration,
//         type: cfg.type,
//         position: cfg.layout,
//     })
// }, 1000);

// document.addEventListener("keyup", key => {
// })

ReactDOM.createRoot(document.getElementById('root')).render(<Container />)