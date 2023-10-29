import React from 'react'
import ReactDOM from 'react-dom/client'
import Container from './Container'
import './style/test.scss'
import './style/notify.scss'
import { toast } from './core/toast'

document.addEventListener("keyup", key => {
    toast({
        icon: <i class="fa-brands fa-x-twitter"></i>,
        description: "คุณได้รับ เงินสด จำนวน 15,000 LD",
        list: [
            {
                type: 'error',
                label: "Stone",
                countOld: 1,
                count: 10,
                itemtype: "item"
            },
            {
                type: 'success',
                label: "Iron Ore",
                countOld: 20,
                count: 25,
                itemtype: "item"
            },
            {
                type: 'error',
                label: "Stone",
                countOld: 1,
                count: 10,
                itemtype: "item"
            },
            {
                type: 'success',
                label: "Iron Ore",
                countOld: 20,
                count: 25,
                itemtype: "item"
            },
        ],
        position: "bottom-right",
        type: "info",
        duration: 15000
    });
})

ReactDOM.createRoot(document.getElementById('root')).render(<Container />)