import { useState } from 'react';
import styled, { keyframes } from 'styled-components'

const Loading = styled.div`
position: absolute;
top: 50%;
left: 50%;
translate: -50% -50%;
width: 80%;
height: 80%;
background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj4NCiAgICA8IS0tISBGb250IEF3ZXNvbWUgUHJvIDYuMi4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlIChDb21tZXJjaWFsIExpY2Vuc2UpIENvcHlyaWdodCAyMDIyIEZvbnRpY29ucywgSW5jLiAtLT4NCiAgICA8cGF0aCBkPSJNMzA0IDQ4YzAtMjYuNS0yMS41LTQ4LTQ4LTQ4cy00OCAyMS41LTQ4IDQ4czIxLjUgNDggNDggNDhzNDgtMjEuNSA0OC00OHptMCA0MTZjMC0yNi41LTIxLjUtNDgtNDgtNDhzLTQ4IDIxLjUtNDggNDhzMjEuNSA0OCA0OCA0OHM0OC0yMS41IDQ4LTQ4ek00OCAzMDRjMjYuNSAwIDQ4LTIxLjUgNDgtNDhzLTIxLjUtNDgtNDgtNDhzLTQ4IDIxLjUtNDggNDhzMjEuNSA0OCA0OCA0OHptNDY0LTQ4YzAtMjYuNS0yMS41LTQ4LTQ4LTQ4cy00OCAyMS41LTQ4IDQ4czIxLjUgNDggNDggNDhzNDgtMjEuNSA0OC00OHpNMTQyLjkgNDM3YzE4LjctMTguNyAxOC43LTQ5LjEgMC02Ny45cy00OS4xLTE4LjctNjcuOSAwcy0xOC43IDQ5LjEgMCA2Ny45czQ5LjEgMTguNyA2Ny45IDB6bTAtMjk0LjJjMTguNy0xOC43IDE4LjctNDkuMSAwLTY3LjlTOTMuNyA1Ni4yIDc1IDc1cy0xOC43IDQ5LjEgMCA2Ny45czQ5LjEgMTguNyA2Ny45IDB6TTM2OS4xIDQzN2MxOC43IDE4LjcgNDkuMSAxOC43IDY3LjkgMHMxOC43LTQ5LjEgMC02Ny45cy00OS4xLTE4LjctNjcuOSAwcy0xOC43IDQ5LjEgMCA2Ny45eiIgZmlsbD0id2hpdGUiIC8+DQo8L3N2Zz4=');
background-size: cover;
background-repeat: no-repeat;
animation: loading 1s linear infinite;
`;


const Image = (maps) => {
  const src = maps.src || "";
  const className = maps.class || "";
  const [loading, setLoading] = useState(true);

  return <>
    {
      loading ? <Loading /> : null
    }
    <img style={{
      opacity: loading ? "0" : "1",
      transition: ".3s"
    }} src={src} onError={({ currentTarget }) => {
      currentTarget.onerror = null;
      currentTarget.src = `https://www.athens-groups.com/img/logo_nobg.png`;
    }} alt="" className={className} onLoad={() => setLoading(false)} draggable={false} />
  </>
}

export default Image;