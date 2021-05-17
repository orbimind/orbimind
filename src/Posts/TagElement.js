import React from 'react'

export default function TagElement({ title }) {
    console.log(title);
    return (
        <button>
            {title}
        </button>
    )
}
