import React from 'react'
import { Link } from 'react-router-dom'

import './Filters.css'
import { Settings } from '../../assets/Misc.jsx'

export default function FilteringBar({ username, favorite, noFilters }) {
    return (
        <div className='filteringBar'>
            {
                username 
                ?
                <div className='userPosts'>
                    {
                        favorite 
                        ? <span>{ username }'s favorite posts</span>
                        : <span>{ username }'s posts</span>
                    }
                </div>
                :
                <div>
                    <span>Didn’t find what you <br />were looking for?</span>
                    <Link to='/posts/create' id='ask'>Ask a question</Link>
                </div>
            }
            {
                noFilters
                ||
                <div>
                    <span>Sort by:&nbsp;</span>
                    <select id='sortBy'>
                        <option>Newest</option>
                        <option>Active</option>
                        <option>Closed</option>
                        <option>Top</option>
                    </select>
                    <button>
                        <Settings width={13} height={12}/>
                        Filters
                    </button>
                </div>
            }
        </div>
    )
}
