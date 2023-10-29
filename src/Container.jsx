import cx from 'clsx';
import { useToastContainer } from "./hooks/useContainer";
import { Toast } from "./components/Toast";
import { useCallback } from 'react';
import { useStore } from './store/store';

const Container = (props) => {
    const { getToastToRender, containerRef, updateHeightToast, calculateOffset } = useToastContainer({
        position: 'top-right',
        duration: 5000,
        role: 'alert',
        theme: 'light',
        limit: 9
    });

    function getClassName(position) {
        const defaultClassName = cx(
            `athens-container`,
            `athens-${position}`
        );

        return cx(defaultClassName);
    }

    return <div
        ref={containerRef}
    >
        {getToastToRender((position, toastList) => {

            return <div
                className={getClassName(position)}
                key={`container-${position}`}
            >
                {toastList.map((t) => ({ ...t, offset: calculateOffset(t) })).map((toastProps, i) => {
                    return <Toast
                        {...toastProps}
                        key={`toast-${toastProps.key}`}
                        updateHeightToast={updateHeightToast}
                    />
                })}
            </div>
        })}
    </div>
}

export default Container