import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Select from 'react-select'

import './Filters.css'
import { Settings } from '../../assets/Misc.jsx'

const options = [
    { value: 'newest', label: 'Newest' },
    { value: 'top', label: 'Top' },
    { value: 'active', label: 'StrawActiveberry' },
    { value: 'closed', label: 'Closed' }
];

export default class FilteringBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: { value: 'newest', label: 'Newest' }
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = selectedOption => {
        this.setState({ selectedOption })
        console.log(`Option selected:`, selectedOption)
    };

    render() {
        return (
            <div className='filteringBar'>
                {
                    this.props.username 
                    ?
                    <div className='userPosts'>
                        {
                            this.props.favorite 
                            ? <span>{ this.props.username }'s favorite posts</span>
                            : <span>{ this.props.username }'s posts</span>
                        }
                    </div>
                    :
                    <div>
                        <span>Didn’t find what you <br />were looking for?</span>
                        <Link to='/posts/create' id='ask'>Ask a question</Link>
                    </div>
                }
                {
                    this.props.noFilters
                    ||
                    <div>
                        <span>Sort by:&nbsp;</span>
                        <Select
                            value={ this.state.selectedOption }
                            onChange={ this.handleChange }
                            options={ options }
                        />
                        <button>
                            <Settings width={13} height={12}/>
                            Filters
                        </button>
                    </div>
                }
            </div>
        )
    }
}
