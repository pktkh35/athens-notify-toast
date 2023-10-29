import React, { useCallback } from 'react';
import cx from 'clsx';

import { isFn } from '../utils/propValidator';
import { getIcon } from './Icons';

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
    }, [toastId])
    // const offset = calculateOffset(toastData)
    const defaultClassName = cx(`athens-toast`, `athens-toast-${type}`);
    const cssClasses = isFn(className) ? className({ position, type, defaultClassName }) : cx(defaultClassName, className);
    const direction = position ? (position.includes("right") ? 'right' : position && position.includes("left") ? 'left' : 'center') : 'right';
    const top = position.includes('top');
    const verticalStyle = top ? { top: 0 } : { bottom: 0 };
    const horizontalStyle = position.includes('center') ? {
        justifyContent: 'center',
    } : position.includes('right') ? {
        justifyContent: 'flex-end',
    } : {};

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
                {getIcon({ type })}
            </div>
            <div className="toast-info">
                {
                    toastData.title ? <div className="toast-title" dangerouslySetInnerHTML={{ __html: toastData.title }} />: null
                }
                {
                    toastData.description ? <div className="toast-description" dangerouslySetInnerHTML={{ __html: toastData.description }} />: null
                }
            </div>
        </div>
    </div>;
};
