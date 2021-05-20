import React from 'react';

export default function Comment({ user_id, rating, date, content }) {
    return (
        <div className="singleComment">
            <div>
                <button id="like">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.835 240.835">
                        <path d="M129.007,57.819c-4.68-4.68-12.499-4.68-17.191,0L3.555,165.803c-4.74,4.74-4.74,12.427,0,17.155c4.74,4.74,12.439,4.74,17.179,0l99.683-99.406l99.671,99.418c4.752,4.74,12.439,4.74,17.191,0c4.74-4.74,4.74-12.427,0-17.155 L129.007,57.819z"/>
                    </svg>
                </button>
                <span id='rating'>5</span>
                <button id="dislike">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.835 240.835">
                        <path d="M129.007,57.819c-4.68-4.68-12.499-4.68-17.191,0L3.555,165.803c-4.74,4.74-4.74,12.427,0,17.155c4.74,4.74,12.439,4.74,17.179,0l99.683-99.406l99.671,99.418c4.752,4.74,12.439,4.74,17.191,0c4.74-4.74,4.74-12.427,0-17.155 L129.007,57.819z"/>
                    </svg>
                </button>
            </div>
            <div>
                <span>Answered by {user_id} <span id="rating">{rating}</span> {date}</span>
                <p>{content}</p>
            </div>
        </div>
    );
}