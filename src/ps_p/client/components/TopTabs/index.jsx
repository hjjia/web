import React, { Component } from 'react';
import { Tabs, Icon } from 'antd';

import restHub from '~comm/services/restHub';
import TimeLine from '../TimeLine';

const TabPane = Tabs.TabPane;

class TopTabs extends Component {

	state = {
		test: '',
	}
	
	getTest = () => {
		console.log('get test');
		restHub.get('http://www.login.com:8899/', function (errorMsg, jsonResult) {
			console.log('hello');
		});
	}

    render() {
        return (
            <div>
                <Tabs tabBarExtraContent=''>
                    <TabPane tab={<span><Icon type="apple" />Tab 1</span>} key="1">
                        <TimeLine />
                    </TabPane>
                    <TabPane tab={<span><Icon type="apple" />Tab 2</span>} key="2">
                        <span onClick={this.getTest} >Content of tab 2</span>
                    </TabPane>
                    <TabPane tab={<span><Icon type="apple" />Tab 3</span>} key="3">
                        Content of tab 3
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default TopTabs;
