import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom'

export default function TagElement({ title }) {
    return (
        <Link to={`/posts?category=${title}`} className="tagButton">
            {title}
        </Link>
    )
}
