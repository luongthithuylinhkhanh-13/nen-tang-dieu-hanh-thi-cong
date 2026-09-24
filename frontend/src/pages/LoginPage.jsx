import React, { useState } from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    const result = loginUser(values.username, values.password);
    setLoading(false);

    if (!result.success) {
      message.error(result.message);
      return;
    }

    message.success('Đăng nhập thành công');
    navigate(location.state?.from?.pathname || '/', { replace: true });
  };

  return (
    <main className="login-page">
      <Card className="login-card" bordered={false}>
        <div className="login-brand">
          <div className="login-brand-mark">CF</div>
          <div>
            <Typography.Title level={3}>CONSTRUCTFLOW</Typography.Title>
            <Typography.Text>Điều hành thi công công trình</Typography.Text>
          </div>
        </div>

        <div className="login-heading">
          <Typography.Title level={2}>Đăng nhập</Typography.Title>
          <Typography.Text>Truy cập không gian làm việc của bạn</Typography.Text>
        </div>

        <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <Form.Item
            label="Tài khoản"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tài khoản' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập tài khoản" size="large" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            Đăng nhập
          </Button>
        </Form>
      </Card>
    </main>
  );
};

export default LoginPage;
