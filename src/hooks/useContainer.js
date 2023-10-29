import { isValidElement, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { eventManager } from "../core/eventManager"
import { toast as TOASTS } from "../core/toast";
import { ADD_TOAST, REMOVE_TOAST, UPDATE_TOAST } from "../store/store";
import { useStore } from "../store/store";

export function useToastContainer(props) {
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const containerRef = useRef(null);
    const toasts = useStore().toasts;
    const isToastActive = (id) => toasts.find(t => t.toastId === id)?.visible;
    const instance = useRef({
        toastKey: 1,
        displayedToast: 0,
        count: 0,
        queue: [],
        props,
        containerId: null,
        isToastActive,
        getToast: id => toasts.find(t => t.toastId === id)
    }).current;

    useEffect(() => {
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
        instance.displayedToast = toasts.length;
    }, [props, isToastActive, toasts]);

    function clearWaitingQueue({ containerId }) {
        const { limit } = instance.props;

        if (limit && (!containerId || instance.containerId === containerId)) {
            instance.count -= instance.queue.length;
            instance.queue = [];
        }
    }

    function DismissToast(toastId) {
        UPDATE_TOAST({
            toastId,
            visible: false,
        })
    }

    function removeToast(toastId) {
        REMOVE_TOAST(toastId);

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
        const { toastId } = toastProps;
        const toast = {
            ...toastProps,
            visible: false
        };

        ADD_TOAST({
            toastId,
            toast
        });

        setTimeout(() => TOASTS.dismiss(toastId), toast.duration)
    }

    function updateHeightToast(
        toastId,
        height
    ) {
        UPDATE_TOAST({
            toastId,
            height,
            visible: true
        });
    }

    const getToastToRender = cb => {
        const toRender = new Map();
        const collection = toasts;

        collection.forEach(toast => {
            const position = toast?.position || "top-right";
            toRender.has(position) || toRender.set(position, []);
            toRender.get(position)?.push(toast);
        });

        return Array.from(toRender, p => cb(p[0], p[1]));
    }

    const calculateOffset = useCallback(toast => {
        const relevantToasts = toasts.filter(t => (t?.position || "top-right") === toast?.position || "top-right");
        const toastIndex = relevantToasts.findIndex((t) => t.toastId === toast.toastId);
        const toastsBefore = relevantToasts.filter((t, i) => i < toastIndex && t.visible).length;

        const offset = relevantToasts
            .filter((t) => t.visible)
            .slice(toastsBefore+1)
            .reduce((acc, t) => acc + (t.height || 0) + 8, 0);

        return offset
    }, [toasts])

    return {
        getToastToRender,
        containerRef,
        updateHeightToast,
        calculateOffset,
    };
}