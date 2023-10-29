import { cloneElement, isValidElement, useEffect, useReducer, useRef, useState } from "react";
import { getIcon } from "../components/Icons";
import { eventManager } from "../core/eventManager"
import { canBeRendered, isStr } from "../utils/propValidator";
import { toast as TOASTS } from "../core/toast";
import { useDispatch, useSelector } from "react-redux";
import { ADD_TOAST, CLEAR_TOAST, REMOVE_TOAST, UPDATE_TOAST } from "../store/reducers";

export function useToastContainer(props) {
    const AlertSound = document.querySelector("#alert");
    const dispatch = useDispatch();
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [toastIds, setToastIds] = useState([]);
    const containerRef = useRef(null);
    const toastToRender = useSelector(state => state.toasts);
    const isToastActive = (id) => toastToRender[id]?.visible;
    const instance = useRef({
        toastKey: 1,
        displayedToast: 0,
        count: 0,
        queue: [],
        props,
        containerId: null,
        isToastActive,
        getToast: id => toastToRender[id]
    }).current;

    useEffect(() => {
        AlertSound.volume = 0.2
        instance.containerId = props.containerId;
        eventManager
            .cancelEmit("WillUnmount")
            .on("Show", buildToast)
            .on("Clear", removeToast)
            .on("Remove", DismissToast)
            .on("ClearWaitingQueue", clearWaitingQueue)
            .emit("DidMount", instance);

        return () => {
            eventManager.emit("WillUnmount", instance);
        };
    }, []);

    useEffect(() => {
        instance.props = props;
        instance.isToastActive = isToastActive;
        instance.displayedToast = toastIds.length;
    }, [props, isToastActive, toastIds]);

    function clearWaitingQueue({ containerId }) {
        const { limit } = instance.props;

        if (limit && (!containerId || instance.containerId === containerId)) {
            instance.count -= instance.queue.length;
            instance.queue = [];
        }
    }

    function DismissToast(toastId) {
        dispatch(UPDATE_TOAST({
            toastId,
            visible: false,
        }))

        setToastIds(toastIds);
    }

    function removeToast(toastId) {
        dispatch(REMOVE_TOAST(toastId));

        const queueLen = instance.queue.length;
        instance.count = toastId == null ? instance.count - instance.displayedToast : instance.count - 1;

        if (instance.count < 0) instance.count = 0;

        if (queueLen > 0) {
            const freeSlot = toastId == null ? instance.props.limit : 1;

            if (queueLen === 1 || freeSlot === 1) {
                instance.displayedToast++;
                dequeueToast();
            } else {
                const toDequeue = freeSlot > queueLen ? queueLen : freeSlot;
                instance.displayedToast = toDequeue;

                for (let i = 0; i < toDequeue; i++) dequeueToast();
            }
        } else {
            forceUpdate();
        }
        setToastIds(state => toastId == null ? [] : state.filter(id => id !== toastId));
    }

    function dequeueToast() {
        const { toast, staleId } = instance.queue.shift();
        appendToast(toast, staleId);
    }

    function buildToast(
        options
    ) {
        const { toastId } = options;
        const { props } = instance;
        instance.count++;
        let toast = {
            // ...props,
            position: props.position,
            ...options,
            createdAt: Date.now(),
            toastId,
            key: options.key || instance.toastKey++,
        };

        if (
            props.limit &&
            props.limit > 0 &&
            instance.count > props.limit
        ) {
            instance.queue.push({ toast });
        } else {
            appendToast(toast);
        }
    }

    function appendToast(
        toastProps
    ) {
        const clickSound = new Audio('./sound/alert.mp3');
        clickSound.volume = 0.15;
        clickSound.play().catch(() => {});
        // AlertSound.play();
        const { toastId } = toastProps;
        const toast = {
            ...toastProps,
            visible: true
        };

        dispatch(ADD_TOAST({
            toastId,
            toast
        }));

        setToastIds(state => [...state, toastId]);
        
        setTimeout(() => TOASTS.dismiss(toastId), toast.duration)
    }

    function updateHeightToast(
        toastId,
        height
    ) {
        dispatch(UPDATE_TOAST({
            toastId,
            height
        }));
    }

    function getToastToRender(cb) {
        const toRender = new Map();
        const collection = Object.values(toastToRender);
        collection.reverse();

        collection.forEach(toast => {
            const position = toast?.position || "top-right";
            toRender.has(position) || toRender.set(position, []);
            toRender.get(position)?.push(toast);
        });

        return Array.from(toRender, p => cb(p[0], p[1]));
    }

    return {
        getToastToRender,
        containerRef,
        updateHeightToast,
    };
}