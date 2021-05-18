import React from 'react'
const style = {
    div: {
        width: "100%",
        height: "fit-content",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alingItems: "center",
        marginTop: "30px"
    },
    button: {
        display: "block",
        width: "30px",
        height: "30px",
        backgroundColor: "rgba(124, 106, 239, 0.8)",
        color: "white"
    },
    buttonLeft: {
        borderTopLeftRadius: "50%",
        borderBottomLeftRadius: "50%",
    },
    buttonRight: {
        borderTopRightRadius: "50%",
        borderBottomRightRadius: "50%",
    },
    buttonInactive: {
        backgroundColor: "rgba(124, 106, 239, 0.7)",
    },
    current: {
        display: "block",
        width: "30px",
        height: "30px",
        backgroundColor: "rgba(124, 106, 239, 0.8)",
        color: "white",
        padding: "0",
        margin: "0",
        fontSize: "1rem"
    }
}

export default function Pagination({ gotoNextPage, gotoPrevPage, currentPage }) {
    return (
        <div style={style.div}>
            {(currentPage == 1) 
            ? <button style={{...style.button, ...style.buttonLeft, ...style.buttonInactive}} disabled="true" onClick={gotoPrevPage}>&larr;</button> 
            : <button style={{...style.button, ...style.buttonLeft}} onClick={gotoPrevPage}>&larr;</button> }
            
            <button style={style.current}>{currentPage}</button>
            <button style={{...style.button, ...style.buttonRight}} onClick={gotoNextPage}>&rarr;</button>
        </div>
    )
}
