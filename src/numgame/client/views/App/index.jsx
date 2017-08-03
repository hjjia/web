import React, { Component } from 'react';

import NumPane from '../../components/NumPane';

class App extends Component {

    render() {
        return (
            <div className="wrapper">
                <div className="main">
                    <NumPane />
                </div>
            </div>
        )
    }
}

export default App;
