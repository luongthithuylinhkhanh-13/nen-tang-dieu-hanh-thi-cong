import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import { MailOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { setAuthUser } from '../../utils/auth';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    const { email, password, remember } = values;

    setLoginError(null);
    setLoading(true);

    try {
      // TODO(T03): Replace mock authentication with Authentication API when T03 is available.
      // Expected API call:
      //   const response = await loginAPI({ email, password });
      //
      // Expected response handling:
      //   - Success: response.user object -> setAuthUser(response.user, remember) -> navigate('/wbs')
      //   - Invalid credentials: setLoginError('Email hoặc mật khẩu không chính xác.')
      //   - Account locked: setLoginError('Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.')
      //   - Other errors: setLoginError('Đã xảy ra lỗi. Vui lòng thử lại sau.')

      // Placeholder: do nothing until T03 Authentication API is ready.
      // Remove this line and uncomment the API call above when T03 is complete.
      setLoginError('Hệ thống đăng nhập chưa sẵn sàng. Vui lòng chờ tích hợp Authentication API (T03).');
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
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

      {loginError && (
        <Alert
          message={loginError}
          type="error"
          showIcon
          closable
          onClose={() => setLoginError(null)}
          style={{ marginBottom: 20 }}
        />
      )}

      <Form
        form={form}
        name="login_form"
        layout="vertical"
        onFinish={handleFinish}
        className="login-form"
        requiredMark={false}
      >
        <Form.Item
          label="EMAIL"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không đúng định dạng' }
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: '#94A3B8' }} />}
            placeholder="Nhập email"
            size="large"
            autoComplete="email"
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
              // TODO(T03): Implement forgot password flow when T03 is available.
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
            disabled={loading}
            block
            icon={<LoginOutlined />}
            className="login-btn"
          >
            ĐĂNG NHẬP
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
