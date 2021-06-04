import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import axios from 'axios'

const styles = {
    form: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    data: {
        fontFamily: 'Roboto, Ubuntu, "Open Sans", "Helvetica Neue", sans-serif',
        fontWeight: '300',
        fontSize: '14px',
        lineHeight: '22px',
        color: 'var(--black-07)',
        background: '#f2f0ff',
        borderBottom: '2px solid #e1e4e8',
        borderRadius: '4px',
        width: '100%',
        padding: '4px 10px'
    },
    link: {
        color: 'var(--theme-purple)',
        fontWeight: '400',
        backgroundColor: 'transparent',
        cursor: 'pointer'
    }
}

export default class CommentEdit extends Component {
    constructor(props) {
        super(props);
        this.user = Cookies.getJSON('user');
        this.state = {
            content: this.props.content
        };
        this.prevButton = null;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleButtons = this.handleButtons.bind(this);
    }

    handleButtons(e) {
        switch(e.code){
            case 'Enter':
            case 'NumpadEnter':
                if(this.prevButton != 'ShiftLeft' && this.prevButton != 'ShiftRight'){
                    e.preventDefault()
                    this.handleSubmit()
                }
                break;
            case 'Escape':
                this.handleCancel(e)
                break;
        }
        this.prevButton = e.code
    }

    handleChange(value) {
        this.setState({
            content: value
        });
    }

    handleCancel() {
        this.props.setContentEditable(<ReactMarkdown>{ this.props.content }</ReactMarkdown>)
    }

    handleSubmit(event) {
        if(event)
            event.preventDefault();
        
        const api = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer '  + this.user.token
            },
            data: {
                content: this.state.content
            },
            url: `https://orbimind.herokuapp.com/api/comments/${ this.props.comment_id }`
        };
        const promise = axios.patch(api.url, api.data, { headers: api.headers });

        toast.promise(
            promise, 
            {
                loading: 'Leaving your mark...',
                success: () => {
                    this.props.setContentEditable(<p>{ this.state.content }</p>)
                    return 'Your comment was updated!'
                },
                error: (error) => {
                    if(error.response.data.errors.content)
                        toast.error(error.response.data.errors.content[0])
                    return error.response.data.message;
                }
            }
        );
    }

    render() {
        return (
            <form style={ styles.form } onSubmit={ this.handleSubmit } onReset={ this.handleCancel } onKeyDown={ this.handleButtons }>
                <textarea style={ styles.data } value={ this.state.content } onChange={ e => this.handleChange(e.target.value) } name='content' type="text" placeholder="Enter a comment.." />
                <div style={{display: 'inline', fontSize: '12px'}}>
                    Escape to <input style={ styles.link } type='reset' value='Cancel' /> • Enter to <input style={ styles.link } type='submit' value='Save' />
                </div>
            </form>  
        )
    }
}
