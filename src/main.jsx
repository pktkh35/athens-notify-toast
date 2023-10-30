import React from 'react'
import ReactDOM from 'react-dom/client'
import Container from './Container'
import './style/test.scss'
import './style/notify.scss'
import { toast } from './core/toast'
import Image from './components/Image'

document.addEventListener("keyup", key => {
    switch (key.which) {
        case 49:
            toast.success({
                title: "System",
                description: "ฉันชอบทะเลสาบเพราะมีบรรยากาศสงบ.",
                duration: 6000,
            })
            break;
        case 50:
            toast.error({
                title: "System",
                description: "การอ่านหนังสือช่วยเสริมความรู้ของฉัน.",
                duration: 6000,
            })
            break;
        case 51:
            toast.info({
                title: "System",
                description: "การเรียนรู้ภาษาใหม่เป็นประสบการณ์ที่น่าสนุก.",
                duration: 6000,
            })
            break;
        case 52:
            toast.warning({
                title: "System",
                description: "การออกกำลังกายทุกวันช่วยรักษาสุขภาพของฉัน.",
                duration: 6000,
                priority: "medium",
            })
            break;
        case 53:
            toast.info({
                color: "#df2222",
                icon: <img src="https://www.athens-groups.com/img/logo_nobg.png" width="32" height="32" />,
                // position: "top-left",
                title: "มีข้อความใหม่",
                description: <>
                    ฉันชอบทะเลสาบเพราะมีบรรยากาศสงบ.
                    <div className="pile-image">
                        <img src="https://media.discordapp.net/attachments/1039146458521284628/1112242531963502622/digital-painting-mountain-with-colorful-tree-foreground_1.jpg" width="256" alt="" />
                    </div>
                </>,
                duration: 6000,
            })
            break;
        case 54:
            toast.success({
                icon: <div className="item-image" >
                    <Image src="https://www.athens-groups.com/img/logo_bg.png" />
                </div>,
                title: "คุณได้รับ เงินสด จำนวน 1,000 บาท",
                list: [
                    {
                        type: "success",
                        label: "เพชร",
                        oldCount: 0,
                        count: 1,
                        itemType: "item",
                    },
                    {
                        type: "success",
                        label: "ไม้",
                        oldCount: 0,
                        count: 1,
                        itemType: "item",
                    },
                    {
                        type: "error",
                        label: "หิน",
                        oldCount: 0,
                        count: 1,
                        itemType: "item",
                    },
                ],
                duration: 6000,
                position: "bottom-right"
            })
            break;
        case 55:
            toast.warning({
                color: "#ff999f",
                title: "พบเจอประชาชนขโมยสายไฟ",
                description: "เพศ: <b>ชาย</b><br/>ถนน: <b>ทดสอบ</b><br /> กด <kbd>ALT</kbd> + <kbd>1</kbd> เพื่อรับเคสนี้",
                duration: 6000,
                position: "top-right",
                priority: "high",
            })
            break;
    }
})

ReactDOM.createRoot(document.getElementById('root')).render(<Container />)