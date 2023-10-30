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
        getToast: id => toasts.find(t => t.toastId === id),
        getToastFromKeyName: (keyName, key) => toasts.find(t => t[keyName] === key)
    }).current;

    useEffect(() => {
        instance.containerId = props.containerId;
        eventManager
            .cancelEmit("WillUnmount")
            .on("Show", buildToast)
            .on("Clear", removeToast)
            .on("Remove", DismissToast)
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

    function DismissToast(toastId) {
        UPDATE_TOAST({
            toastId,
            hide: true,
        })
    }

    function removeToast(toastId) {
        REMOVE_TOAST(toastId);

        const queueLen = instance.queue.length;
        instance.count--;

        if (instance.count < 0) instance.count = 0;

        if (queueLen > 0) {
            instance.displayedToast++;
            dequeueToast();
        }
    }

    function dequeueToast() {
        const { toast, staleId } = instance.queue.shift();
        appendToast(toast, staleId);
    }

    function buildToast(
        options
    ) {
        const { toastId, priority } = options;
        const { props } = instance;
        instance.count++;

        let toast = {
            position: props.position,
            ...options,
            createdAt: Date.now(),
            toastId,
            key: options.key || instance.toastKey++,
            priority: priority === "high" ? 2 : priority === "medium" ? 1 :0,
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
            visible: false,
            hide: false,
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

        const sortedToasts = Array.from(toRender, (p) => [p[0],p[1].sort((a, b) => b.priority - a.priority)]);

        return sortedToasts.flatMap((p) => cb(p[0], p[1]));
    }

    const calculateOffset = useCallback(toast => {
        const relevantToasts = toasts.filter(t => (t?.position || "top-right") === (toast?.position || "top-right")).sort((a, b) => a.priority - b.priority);
        const toastIndex = relevantToasts.findIndex((t) => t.toastId === toast.toastId);
        const toastsBefore = relevantToasts.filter((t, i) => i < toastIndex && t.visible).length;

        const offset = relevantToasts.filter((t) => t.visible).slice(toastsBefore + 1).reduce((acc, t) => acc + (t.height || 0) + 8, 0);

        return offset
    }, [toasts])

    return {
        getToastToRender,
        containerRef,
        updateHeightToast,
        calculateOffset,
    };
}