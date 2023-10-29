import React, { useCallback, useEffect, useRef } from 'react';
import cx from 'clsx';

import { isFn } from '../utils/propValidator';
import { getIcon } from './Icons';

const formatMoney = (n, c, d, t) => {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;

    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t);
};

const setCount = (count, type) => {
    let cs
    if (type === "account") {
        cs = "$" + formatMoney(count);
    } else {
        cs = count + " ชิ้น";
    }

    return cs
}

export const CountText = ({
    pValue = 0,
    value,
    duration = 300,
    type
}) => {
    const savedNumber = useRef(pValue);
    const numberRef = useRef(null);
    const counterAnim = (qSelector, start = 0, end, duration = 350) => {
        const target = qSelector.current;
        if (qSelector && target) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                target.innerText = setCount(Math.floor(progress * (end - start) + start), type);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
    };

    useEffect(() => {
        counterAnim(numberRef, savedNumber.current, value, duration)
        savedNumber.current = value;
    }, [value]);

    return <span className="price-text" ref={numberRef}></span>
}

export const Toast = (toastData) => {
    const {
        type,
        position = "top-right",
        className,
        toastId,
        visible,
        updateHeightToast,
        offset,
    } = toastData
    const toastRef = useCallback(el => {
        if (el) {
            const height = el.getBoundingClientRect().height;
            updateHeightToast(toastId, height);
        }
    }, [toastId]);
    const defaultClassName = cx(`athens-toast`, `athens-toast-${type}`);
    const cssClasses = isFn(className) ? className({ position, type, defaultClassName }) : cx(defaultClassName, className);
    const direction = position ? (position.includes("right") ? 'right' : position && position.includes("left") ? 'left' : 'center') : 'right';
    const top = position.includes('top');
    const verticalStyle = top ? { top: 0 } : { bottom: 0 };
    const horizontalStyle = position.includes('center') ? { justifyContent: 'center' } : position.includes('right') ? { justifyContent: 'flex-end' } : {};

    return <div
        id={toastId}
        className={cssClasses}
        style={{
            transform: `translateY(${offset * (top ? 1 : -1)}px)`,
            ...horizontalStyle,
            ...verticalStyle,
        }}
    >
        <div className="toast-content" ref={toastRef} style={{
            animation: visible ? `custom-enter-${direction} 230ms cubic-bezier(.21,1.02,.73,1) forwards` : `custom-exit-${direction} 230ms cubic-bezier(.06,.71,.55,1) forwards`,
        }}>
            <div className="toast-icon">
                {toastData.icon ? toastData.icon : getIcon({ type })}
            </div>
            <div className="toast-info">
                {
                    toastData.title && typeof toastData.title !== "string" ? <div className="toast-title">
                        {toastData.title}
                    </div> : toastData.title && typeof toastData.title === "string" ? <div className="toast-title" dangerouslySetInnerHTML={{ __html: toastData.title }} /> : null
                }
                {
                    toastData.description && typeof toastData.description !== "string" ? <div className="toast-description">
                        {toastData.description}
                    </div> : toastData.description && typeof toastData.description === "string" ? <div className="toast-description" dangerouslySetInnerHTML={{ __html: toastData.description }} /> : null
                }
                {
                    toastData.list ? <div className="toast-item-list">
                        {
                            toastData.list.map(item => {
                                return <div className={"item " + item.type}>
                                    <div className="icon">
                                        {getIcon({ type: item.type })}
                                    </div>
                                    <div className="text">
                                        คุณ{(item.type === "success" ? "ได้รับ" : item.type === "error" ? "สูญเสีย" : "") + " " + item.label + " จำนวน "} <CountText pValue={item.oldCount} value={item.count} type={item.itemType} />
                                    </div>
                                </div>
                            })
                        }
                    </div> : null
                }
            </div>
        </div>
    </div>;
};
