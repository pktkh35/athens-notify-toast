import { useState } from 'react'

const Image = ({
    src
}) => {
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    return <>
        <i className="fa-light fa-spinner-third fa-spin" style={{
            visibility: isError && !loading ? "visible" : "hidden",
            opacity: isError && !loading ? "1" : "0",
        }} />
        <img src={src} alt="" onError={e => {
            e.preventDefault();
            e.onerror = undefined;
            setIsError(true);
        }} onLoad={() => setLoading(false)} style={{
            visibility: !(isError && !loading) ? "visible" : "hidden",
            opacity: !(isError && !loading) ? "1" : "0",
        }}  />
    </>
}

export default Image