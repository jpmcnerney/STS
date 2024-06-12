import './index.scss'
import Logo from '../../assets/images/jplogooutlined.png'
import { Link, NavLink } from 'react-router-dom'
import { faCircleInfo, faEnvelope, faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Sidebar = () => {

    return (
    
    <div className = 'nav-bar'>
        <div className = 'nav-title'>
            SmallTalkStatistics
        </div>
        <nav className = 'buttons'>
            <NavLink exact = "true" activeclassname = "active" className = "portfolio-link" to = "/">
                <FontAwesomeIcon icon = {faHome} color = "#fff" />
            </NavLink>
            <NavLink exact = "true" activeclassname = "active" className = "info-link" to = "/info">
                <FontAwesomeIcon icon = {faCircleInfo} color = "#fff" />
            </NavLink>
            <NavLink exact = "true" activeclassname = "active" className = "contact-link" to = "/contact">
                <FontAwesomeIcon icon = {faEnvelope} color = "#fff" />
            </NavLink>
        </nav>
        <Link className = 'logo' to = 'https://jpmcnerney.com' target = '_blank'>
            <img src = {Logo} alt = "logo" />
        </Link>
    </div>
    )
}


export default Sidebar