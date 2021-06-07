import React from 'react'
import { Link } from 'react-router-dom'
import '../Animations.css'

export default function TagElement({ title }) {
    return (
        <Link to={`/posts?category=${ title }`} className="tagButton fadeIn">
            { title }
        </Link>
    )
}
