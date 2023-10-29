import cx from 'clsx';
import { useToastContainer } from "./hooks/useContainer";
import { Toast } from "./components/Toast";
import { useSelector } from 'react-redux';

const Container = (props) => {
    const toastToRender = useSelector(state => state.toasts);
    const { getToastToRender, containerRef, updateHeightToast } = useToastContainer({
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
            const calculateOffset = toast => {
                const relevantToasts = toastList.filter(t => t.height);
                const toastIndex = relevantToasts.findIndex(t => t.toastId === toast.toastId);
                const toastsBefore = relevantToasts.filter((t, i) => i < toastIndex && t.visible).length;

                const offset = relevantToasts
                    .filter((t) => t.visible)
                    .slice(0, toastsBefore)
                    .reduce((acc, t) => acc + (t.height || 0) + 8, 0);

                return offset
            }
            return <div
                className={getClassName(position)}
                key={`container-${position}`}
            >
                {toastList.map((toastProps, i) => {
                    const offset = calculateOffset(toastProps)
                    return <Toast
                        {...toastProps}
                        key={`toast-${toastProps.key}`}
                        updateHeightToast={updateHeightToast}
                        offset={offset}
                    />
                })}
            </div>
        })}
    </div>
}

export default Container