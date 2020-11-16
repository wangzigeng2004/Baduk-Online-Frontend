import React from 'react';
import { Form, Input, Button, Col, Select, message } from 'antd';
import { DesktopOutlined } from '@ant-design/icons';

import { Redirect } from 'react-router-dom';
import { socket } from "./api";

const { Option } = Select;

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

class RoomJoin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitted: false
        }
    }

    formRef = React.createRef();

    componentDidMount() {
    }

    componentWillUnmount() {
        // this.props.history.goForward();
    }

    handleSubmit = (values) => {
        console.log('Success:', values);
        const room = values.room;
        const role = values.role;
        console.log(`user: ${this.props.username} joined room ${room} as ${role}`);
        if (role === 'player') {
            socket.emit('join_room_player', { username: this.props.username, room_id: room });
        } else {
            socket.emit('join_room_bystander', { username: this.props.username, room_id: room })
        }
        this.props.cb(this.props.username, room);
        message.success(`joined room ${room} as ${role}`)
        this.setState({ submitted: true })
    }

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    onReset = () => {
        this.formRef.current.resetFields();
    };

    // onRoleChange = value => {
    //     switch (value) {
    //         case 'player':
    //             this.formRef.current.setFieldsValue({
    //                 role: 'player',
    //             });
    //             return;
    //         case 'bystander':
    //             this.formRef.current.setFieldsValue({
    //                 role: 'bystander',
    //             });
    //             return;
    //         default:
    //             return;
    //     }
    // }


    render() {
        const submitted = this.state.submitted;
        if (submitted) {
            return (
                <Redirect to="/game" />
            )
        }
        return (
            <div>
                <Form
                    {...layout}
                    name="basic"
                    onFinish={this.handleSubmit}
                    onFinishFailed={this.onFinishFailed}
                    initialValues={{
                        role: 'player'
                    }}
                    ref={this.formRef}>
                    <Form.Item
                        label="room id"
                        name="room"
                        rules={[
                            {
                                required: true,
                                message: 'Please input room id!',
                            },
                        ]}>
                        <Col span={6}>
                            <Input
                                size="large"
                                placeholder="Enter game room id"
                                prefix={<DesktopOutlined className="site-form-item-icon" />}
                                allowClear
                            />
                        </Col>
                    </Form.Item>
                    <Form.Item
                        label='role'
                        name='role'
                        rules={
                            [{
                                required: true,
                            }]
                        }>
                        <Col span={6}>
                            <Select defaultValue="player">
                                <Option value="player">Player</Option>
                                <Option value="bystander">Observer</Option>
                            </Select>
                        </Col>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" size='large' htmlType="submit">
                            Join Room
                        </Button>
                        <Button htmlType="button" size='large' onClick={this.onReset}>
                            Reset
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default RoomJoin;