import React from 'react'
import { Link } from 'react-router-dom'

import { Pair, Answer, Typing, Thinking, Questions } from '../../assets/Undraw.jsx'
import './Home.css'
import '../Animations.css'

const style = {
    themeWord: {
        color: '#7c6aef'
    }
}

function Buttons() {
    return (
        <div className='buttonsTo'>
            <Link to='/posts'>Explore</Link>
            <Link to='/login'>Become a part</Link>
        </div>
    )
}

export default function Home() {
    return (
        <div className='homeRoot'>
            <div className='home'>
                <div className='introBlock'>
                    <div>
                        <h1 className='listPopInSideways'>Where great <span style={style.themeWord}>minds</span> are in the same <span style={style.themeWord}>orbit</span>.</h1>
                        <span className='listPopInSideways'>Explore the greatest community of knowledge and become one of the best. Create your own orbit.</span>
                        <Buttons />
                    </div>
                    <Thinking className='fadeIn' width={512} height={512} />
                </div>
                <div className='perksBlock'>
                    <div className='listPopInUnder'>
                        <Questions width={200} height={200} />
                        <h2>Feel free to ask</h2>
                        <p>The community is full of friendly people that are ready to help. Just ask whatever you stuck with and be ready to learn.</p>
                    </div>
                    <div className='listPopInUnder'>
                        <Pair width={200} height={200} />
                        <h2>Discuss</h2>
                        <p>Your code needs to be shared! Discuss with others how you can improve your coding skills and the quality of your code.</p>
                    </div>
                    <div className='listPopInUnder'>
                        <Typing width={200} height={200} />
                        <h2>Create together</h2>
                        <p>Your solutions definitely are powerful, but power is not limited. Invite people to see your projects and let them improve them.</p>
                    </div>
                    <div className='listPopInUnder'>
                        <Answer width={200} height={200} />
                        <h2>Be the best</h2>
                        <p>Fight for the checkmark. Explain your solutions as precisely as you can and get awarded!</p>
                    </div>
                </div>
            </div>
            <div className='outroBlock fadeIn'>
                <h1>Join a growing community.</h1>
                <span>Explore a variety of topics, learn and <br/>help other people to get better.</span>
                <Buttons />
                <div>
                    <Link to='/help'>Help </Link> &#8857; <Link to='/help/api'> API</Link>
                </div>
            </div>
        </div>
    )
}
