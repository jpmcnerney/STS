import { useRef } from 'react';
import emailjs from '@emailjs/browser'
import './index.scss';

const Contact = () => {

    const form = useRef()

    const sendEmail = (e) => {
        e.preventDefault()

    emailjs
      .sendForm('service_5zbl2bs', 'template_u4l0yxu', form.current, 'Vkgxoo6-GGGy4nEXY')
      .then(
        () => {
          alert('Message successfully sent!')
          window.location.reload(false)
        },
        () => {
          alert('Failed to send the message, please try again')
        }
      )
    }
    
    return (
        <> 
        <div className="container contact-page">
            <div className="text-zone">
                <p className="top-label">Use the menu below to send me a message!</p>
                <div className="contact-form">
                    <form ref = {form} onSubmit = {sendEmail}>
                        <ul>
                            <li className = "half">
                                <input type = "text" name = "from_name" placeholder = "Name" required />
                            </li>
                            <li className = "half">
                                <input type = "email" name = "email" placeholder = "Email" required />
                            </li>
                            <li>
                                <input placeholder = "Subject" type = "text" name = "subject" required />
                            </li>
                            <li>
                                <textarea placeholder = "Message" name = "message" required></textarea>
                            </li>
                            <li>
                                <input type = "submit" className = "flat-button" value = "Send" />
                            </li>
                        </ul>
                    </form>
                </div>
            </div>
        </div>
    </>
    )

}

export default Contact