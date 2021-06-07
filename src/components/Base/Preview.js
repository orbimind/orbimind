import React from 'react';
import './Preview.css';

export default function Preview({ title }) {
    return (
        <div className='previewRoot'>
            <div className='preview unselectable'>
                <label>{title}</label>
            </div>
        </div>
    );
}
