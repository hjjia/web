import React, { Component } from 'react';
import { Tabs, Icon, Modal } from 'antd';
import './index.less';

const TabPane = Tabs.TabPane;
// const alert = Modal.alert;

const itemArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '空格', '占位符']
class NumPane extends Component {
    state = {
        prevNum: '',
        currentNum: null,
        inputTxt: '',
        resultModalVisible: false,
        gameOver: false,
    }

    handleItemClick = (txt) => {
        console.log(txt, 'item');
        const { inputTxt, prevNum } = this.state;

        if (txt === '空格') {
            if (!prevNum) {
                this.setState({
                    prevNum: inputTxt
                });
            } else {
                if (prevNum * 1 + 1 !== inputTxt * 1) {
                    console.log('you are wrong');
                    this.setState({
                        resultModalVisible: true,
                    });

                    // const alertInstance = alert('删除', '确定删除么???', [
                    //     { text: 'Cancel', onPress: () => console.log('cancel'), style: 'default' },
                    //     { text: 'OK', onPress: () => console.log('ok') },
                    // ]);
                }
            }

            this.setState({
                inputTxt: ''
            });

        } else if (txt === '占位符') {

        } else {
            this.setState({
                inputTxt: inputTxt + '' + txt
            });
        }
    }

    beginGameAgain = () => {
        this.setState({
            prevNum: '',
            currentNum: null,
            inputTxt: '',
            resultModalVisible: false
        });
    }

    gameOverFun = () => {
        this.setState({
            prevNum: '',
            currentNum: null,
            inputTxt: '',
            resultModalVisible: false,
            gameOver: true
        })
    }

    render() {
        const numItemHtml = itemArr.map((item) => {
            return (
                <div
                    key={item}
                    className="num-item"
                    onClick={this.handleItemClick.bind(this, item)}
                >
                    {item}
                </div>
            )
        });

        const {
            inputTxt,
            prevNum,
            resultModalVisible,
            gameOver
        } = this.state;
        return (
            !gameOver ? (
                <div className="game-page">
                    <div className="input-wrapper">
                        {inputTxt}
                    </div>

                    <div className="num-wrapper">
                        {numItemHtml}
                    </div>

                    <Modal
                        visible={resultModalVisible}
                        transparent
                        title="游戏结束"
                        onOk={this.beginGameAgain}
                        onCancel={this.gameOverFun}
                        okText="再次挑战"
                        cancelText="退出"
                        wrapClassName="vertical-center-modal result-modal"
                        width={400}
                    >
                        您的成绩为
                        <span className="must bold">{prevNum}</span>
                    </Modal>
                </div>
            ) : (
                <div className="result-page">
                    感谢您的参与
                </div>
            )
        );
    }
}

export default NumPane;
