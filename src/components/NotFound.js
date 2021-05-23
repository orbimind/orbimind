import React from 'react';

const style = {
    div: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alingItems: "center",
    },
}

export default function NotFound() {
    return (
        <div style={style.div}>
            404
        </div>
    )
}
