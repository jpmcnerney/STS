import { useRef } from 'react';
import emailjs from '@emailjs/browser'
import './index.scss';

const Info = () => {
    
    return (
        <> 
        <div className="container info-page">
            <p className = "header">Info</p>
            <p className = "description">Even during small talk, we are all incredibly unique. SmallTalkStatistics was developed in 2024 with the aim of numerically and statistically embracing our surface level individuality. By using this website, you've increased our sample size of users, increasing the accuracy of the data we present to the next user. Thank you!</p>
            <p className = "description">Why is embracing individuality important?<br></br>Those who are able to recognize themselves as an individual are more likely to:</p>
            <ul className = "info-list">
                <li>Create, innovate, and drive progress</li>
                <li>Embrace self acceptance and therefore self confidence</li>
                <li>Build better relationships due to their empathy</li>
                <li>Adapt to new environments using their open-mindedness</li>
                <li>Empower themselves to pursue their passions</li>
                <li>Lead strong teams due to their understanding of others abilities</li>
                <li>Hold themselves responsible to a higher standard</li>
            </ul>
        </div>
    </>
    )

}

export default Info