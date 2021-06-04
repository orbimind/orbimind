import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
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
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
  
      return { ...provided, opacity, transition };
    }
}

class FilteringBar extends Component {
    constructor(props) {
        super(props)

        const query = new URLSearchParams(location.search.slice(1))
        let selectedState = { value: 'newest', label: 'Newest' }
        switch(query.get('order')) {
            case 'date$desc':
                selectedState = { value: 'newest', label: 'Newest' }
                break;
            case 'date$asc':
                selectedState = { value: 'oldest', label: 'Oldest' }
                break;
            case 'rating$desc':
                selectedState = { value: 'top', label: 'Top' }
                break;
            default: selectedState = { value: 'newest', label: 'Newest' }
        }
        switch(query.get('status')) {
            case '1':
                selectedState = { value: 'active', label: 'Active' }
                break;
            case '0':
                selectedState = { value: 'closed', label: 'Closed' }
                break;
            default: selectedState = { value: 'newest', label: 'Newest' }
        }

        this.state = {
            selectedOption: selectedState
        };

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange = selectedOption => {
        if(selectedOption.value == this.state.selectedOption.value)
            return

        this.setState({ selectedOption })
        switch(selectedOption.value){
            case 'newest':
                this.props.history.push(`${location.pathname}?order=date$desc`)
                break;
            case 'top':
                this.props.history.push(`${location.pathname}?order=rating$desc`)
                break;
            case 'active':
                this.props.history.push(`${location.pathname}?status=1`)
                break;
            case 'closed':
                this.props.history.push(`${location.pathname}?status=0`)
                break;
            case 'oldest':
                this.props.history.push(`${location.pathname}?order=date$asc`)
                break;
        }
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
}

export default withRouter(FilteringBar)
