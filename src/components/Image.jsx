import * as React from 'react';
import { useState } from 'react'

const Image = ({
    src,
    errorSrc = "",
}) => {
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    return <>
        <img src={src} alt="" onError={e => {
            e.preventDefault();
            if (errorSrc !== "") { e.target.src = errorSrc };
            e.onerror = undefined;
            setIsError(true);
        }} onLoad={() => setLoading(false)} style={{
            visibility: !(isError && !loading) ? "visible" : "hidden",
            opacity: !(isError && !loading) ? "1" : "0",
        }}  />
    </>
}

export default Image