import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { setAuthUser } from '../../utils/auth';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    const { username, password, remember } = values;

    setLoading(true);

    setTimeout(() => {
      if (username === 'admin' && password === '123456') {
        const userObj = {
          username: 'admin',
          fullName: 'Quản trị viên',
          role: 'Administrator',
          loginTime: new Date().toISOString()
        };

        if (remember) {
          setAuthUser(userObj);
        } else {
          sessionStorage.setItem('construction_demo_auth', JSON.stringify(userObj));
          setAuthUser(userObj);
        }

        message.success('Đăng nhập thành công');
        navigate('/wbs');
      } else {
        message.error('Tên đăng nhập hoặc mật khẩu không chính xác');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="login-form-container">
      <div className="login-header">
        <div className="login-mobile-logo">
          <span className="login-mobile-logo-text">CONSTRUCTFLOW</span>
        </div>
        <h2 className="login-title">Chào mừng trở lại</h2>
        <p className="login-subtitle">Đăng nhập để tiếp tục quản lý công trình</p>
      </div>

      <Form
        form={form}
        name="login_form"
        layout="vertical"
        onFinish={handleFinish}
        className="login-form"
        requiredMark={false}
      >
        <Form.Item
          label="TÊN ĐĂNG NHẬP"
          name="username"
          rules={[
            { required: true, message: 'Vui lòng nhập tên đăng nhập' }
          ]}
        >
          <Input
            prefix={<UserOutlined style={{ color: '#94A3B8' }} />}
            placeholder="Nhập tên đăng nhập"
            size="large"
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          label="MẬT KHẨU"
          name="password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#94A3B8' }} />}
            placeholder="Nhập mật khẩu"
            size="large"
            autoComplete="current-password"
          />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Form.Item name="remember" valuePropName="checked" noStyle initialValue={true}>
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>
          <a
            href="#forgot"
            onClick={(e) => {
              e.preventDefault();
              message.info('Chức năng demo: Vui lòng sử dụng tài khoản admin / 123456');
            }}
            style={{ color: '#2563EB', fontSize: 13, fontWeight: 500 }}
          >
            Quên mật khẩu?
          </a>
        </div>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            icon={<LoginOutlined />}
            className="login-btn"
          >
            ĐĂNG NHẬP
          </Button>
        </Form.Item>
      </Form>

      {/* Demo Credentials Helper Box */}
      <div className="demo-account-box">
        <div className="demo-account-header">
          <InfoCircleOutlined /> TÀI KHOẢN DEMO
        </div>
        <div className="demo-account-info">
          <div>Tên đăng nhập: <strong>admin</strong></div>
          <div>Mật khẩu: <strong>123456</strong></div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
