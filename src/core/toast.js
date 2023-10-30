import { isStr, isNum } from '../utils/propValidator';
import { eventManager } from './eventManager';

let containers = new Map();
let latestInstance;
let queue = [];
let TOAST_ID = 0;

/**
 * Generate a random toastId
 */
function generateToastId() {
  return (++TOAST_ID).toString();
}

/**
 * Generate a toastId or use the one provided
 */
function getToastId(options) {
  return options && (isStr(options.toastId) || isNum(options.toastId))
    ? options.toastId
    : generateToastId();
}

/**
 * If the container is not mounted, the toast is enqueued and
 * the container lazy mounted
 */
function dispatchToast(
  options
) {
  if (containers.size > 0) {
    eventManager.emit("Show", options);
  } else {
    queue.push({ options });
  }

  return options.toastId;
}

/**
 * Merge provided options with the defaults settings and generate the toastId
 */
function mergeOptions(type, options) {
  return {
    ...options,
    type: (options && options.type) || type,
    toastId: getToastId(options)
  };
}

function createToastByType(type) {
  return (
    options
  ) => dispatchToast(mergeOptions(type, options));
}

function toast(
  options
) {
  return dispatchToast(mergeOptions("info", options));
}

toast.loading = (
  options
) =>
  dispatchToast(
    mergeOptions("info", {
      isLoading: true,
      closeOnClick: false,
      closeButton: false,
      draggable: false,
      ...options
    })
  );

toast.success = createToastByType("success");
toast.info = createToastByType("info");
toast.error = createToastByType("error");
toast.warning = createToastByType("warning");
toast.warn = toast.warning;

const toastTimeouts = new Map()
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    eventManager.emit("Clear", toastId);
  }, 300)

  toastTimeouts.set(toastId, timeout);
};

/**
 * Remove toast programmaticaly
 */
toast.dismiss = (id) => {
  if (containers.size > 0) {
    addToRemoveQueue(id);
    eventManager.emit("Remove", id);
  } else {
    queue = queue.filter(t => id != null && t.options.toastId !== id);
  }
};

/**
 * return toastData if one container is displaying the toast
 */
toast.getByKeyName = (keyName, key) => {
  let toast = false;

  containers.forEach(container => {
    if (container.getToastFromKeyName) {
      toast = container.getToastFromKeyName(keyName, key);
    }
  });

  return toast;
}

/**
 * return true if one container is displaying the toast
 */
toast.isActive = (id) => {
  let isToastActive = false;

  containers.forEach(container => {
    if (container.isToastActive && container.isToastActive(id)) {
      isToastActive = true;
    }
  });

  return isToastActive;
};

/**
 * Wait until the ToastContainer is mounted to dispatch the toast
 * and attach isActive method
 */
eventManager
  .on("DidMount", (containerInstance) => {
    latestInstance = containerInstance.containerId || containerInstance;
    containers.set(latestInstance, containerInstance);

    queue.forEach(item => {
      eventManager.emit("Show", item.options);
    });

    queue = [];
  })
  .on("WillUnmount", (containerInstance) => {
    containers.delete(containerInstance.containerId || containerInstance);

    if (containers.size === 0) {
      eventManager.off("Show").off("Clear")
    }
  });

export { toast };
