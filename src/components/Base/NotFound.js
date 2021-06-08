import React from 'react'
import { Link } from 'react-router-dom'
import { ErrorPage } from '../../assets/Undraw.jsx'

const style = {
    div: {
        width: "100%",
        height: "calc(100vh - 520px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    error: {
        transform: 'translateY(-120px)',
        opacity: '0.2',
        fontSize: '18px',
        fontWeight: '500',
        color: 'white'
    },
    h1: {
        color: 'var(--black-07)'
    },
    a: {
        display: 'grid',
        placeItems: 'center',
        width: '100px',
        height: '30px',
        backgroundColor: '#7c6aef',
        borderRadius: '10px',
        fontWeight: '600',
        fontSize: '14px',
        lineHeight: '16px',
        color: 'white',
        textDecoration: 'none',
        marginTop: '20px',
        boxShadow: 'var(--shadow-default)'
    }
}

export default function NotFound() {
    return (
        <div style={style.div} className='unselectable'>
            <ErrorPage width={400} height={400} />
            <span style={style.error}>Error 404</span>
            <h1 style={style.h1}>Looks like you've got lost</h1>
            <Link to='/' style={style.a}>Go home</Link>
        </div>
    )
}
