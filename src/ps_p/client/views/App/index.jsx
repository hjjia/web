import React, { Component } from 'react';

import TopTabs from '../../components/TopTabs';

class App extends Component {

    render() {
        return (
            <div className="wrapper">
                <div className="header border-yellow">
                    <div className="nav">
                        header
                    </div>
                </div>

                <div className="main">
                    <TopTabs />
                </div>
            </div>
        )
    }
}

export default App;
