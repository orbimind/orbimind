import React from 'react'
import { Link } from 'react-router-dom'
import '../Misc/Animations.css'

export default function TagElement({ title }) {
    return (
        <Link to={`/posts?category=${ title }`} className="tagButton fadeIn">
            { title }
        </Link>
    )
}
