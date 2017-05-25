import React, {Component} from 'react'
import '../css/order/menu.css'

class Banner extends Component {
    
    render() {
        return (
            <nav className="navbar navbar-toggleable-sm navbar-light">
                <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <a className="navbar-brand">
                    <div className="banner">Dagobah <span style={{'color':'orange'}}>Diner</span>
                        <div className="sub">We bet you won’t find better</div>
                    </div>

                </a>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/orderview"><h3>Orderview</h3></a>
                        </li>
                    </ul>

                </div>

            </nav>
        );
    }
}

export default Banner;