import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'

import './Filters.css'
// import { Settings } from '../../assets/Misc.jsx'

const options = [
    { value: 'newest', label: 'Newest' },
    { value: 'top', label: 'Top' },
    { value: 'active', label: 'Active' },
    { value: 'closed', label: 'Closed' },
    { value: 'oldest', label: 'Oldest' }
];

const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'white' : 'black',
      fontSize: 14,
      padding: 10,
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1
      const transition = 'opacity 300ms'
      return { ...provided, opacity, transition }
    }
}

export default function FilteringBar({ username, favorite, noFilters }) {
    const query = new URLSearchParams(location.search.slice(1))
    let selectedState = { value: 'newest', label: 'Newest' }
    switch(query.get('order')) {
        case 'date$desc':
            selectedState = { value: 'newest', label: 'Newest' }
            break
        case 'date$asc':
            selectedState = { value: 'oldest', label: 'Oldest' }
            break
        case 'rating$desc':
            selectedState = { value: 'top', label: 'Top' }
            break
    }
    switch(query.get('status')) {
        case '1':
            selectedState = { value: 'active', label: 'Active' }
            break
        case '0':
            selectedState = { value: 'closed', label: 'Closed' }
            break
    }
    const [selectedOption, setSelectedOption] = useState(selectedState)
    const history = useHistory()

    const handleChange = newOption => {
        if(newOption.value == selectedOption.value)
            return

        setSelectedOption(newOption)
        switch(newOption.value){
            case 'newest':
                history.push(`${location.pathname}?order=date$desc`)
                break
            case 'top':
                history.push(`${location.pathname}?order=rating$desc`)
                break
            case 'active':
                history.push(`${location.pathname}?status=1`)
                break
            case 'closed':
                history.push(`${location.pathname}?status=0`)
                break
            case 'oldest':
                history.push(`${location.pathname}?order=date$asc`)
                break
        }
    }

    return (
        <div className='filteringBar unselectable'>
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
                    <Select
                        value={ selectedOption }
                        onChange={ newOption => handleChange(newOption) }
                        options={ options }
                        styles={ customStyles }
                        theme={ theme => ({
                            ...theme,
                            colors: {
                                primary25: '#988af2',
                                primary: '#7c6aef',
                                neutral0: '#f8f7ff',
                                neutral90: 'white',
                                neutral80: 'rgba(24, 24, 26, 0.8)',
                                neutral60: '#7c6aef',
                                neutral50: 'rgba(24, 24, 26, 0.5)',
                                neutral40: '#7c6aef',
                                neutral30: 'rgba(24, 24, 26, 0.6)',
                                neutral20: '#e1e4e8',
                                danger: '#ea3c53',
                                dangerLight: 'rgba(234, 60, 83, 0.2)',
                                neutral10: 'rgba(24, 24, 26, 0.1)'
                            }
                        })}
                    />
                    {/* <button>
                        <Settings width={13} height={12}/>
                        Filters
                    </button> */}
                </div>
            }
        </div>
    )
}
