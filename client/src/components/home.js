import React, {Component} from 'react'
import PageTransition from "react-router-page-transition";

class Home extends Component {
    
    render() {
        return (
            <PageTransition>
                {this.props.children}
            </PageTransition>
        );
    }
}

export default Home;