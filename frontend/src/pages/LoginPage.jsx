import '../styles/login.css';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuildOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Progress } from 'antd';
import LoginForm from '../components/auth/LoginForm';
import { isAuthenticated } from '../utils/auth';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/wbs');
    }
  }, [navigate]);

  return (
    <div className="login-container">
      {/* Left Hero Panel */}
      <div className="login-hero">
        <div className="hero-brand">
          <BuildOutlined className="hero-logo-icon" />
          <span className="hero-brand-name">CONSTRUCTFLOW</span>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <BuildOutlined /> GIẢI PHÁP QUẢN LÝ CÔNG TRÌNH
          </div>

          <h1 className="hero-title">
            Điều hành công trình<br />trực quan và hiệu quả
          </h1>

          <p className="hero-description">
            Quản lý cơ cấu công việc, theo dõi tiến độ và tổ chức thi công trên một nền tảng thống nhất.
          </p>

          {/* Visual Preview Card */}
          <div className="hero-preview-card">
            <div className="preview-card-header">
              <span className="preview-card-title">TIẾN ĐỘ DỰ ÁN</span>
              <span style={{ fontSize: 13, color: '#38BDF8', fontWeight: 600 }}>DA-001</span>
            </div>

            <div className="preview-project-name">
              Xây dựng tòa nhà văn phòng A
            </div>

            <div style={{ marginTop: 14, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4, color: '#CBD5E1' }}>
                <span>Tiến độ tổng thể</span>
                <span style={{ fontWeight: 700, color: '#38BDF8' }}>68%</span>
              </div>
              <Progress percent={68} showInfo={false} strokeColor="#2563EB" trailColor="rgba(255,255,255,0.1)" />
            </div>

            <div className="preview-stats-grid">
              <div className="preview-stat-item">
                <div className="preview-stat-value">24</div>
                <div className="preview-stat-label">Công việc</div>
              </div>
              <div className="preview-stat-item">
                <div className="preview-stat-value" style={{ color: '#10B981' }}>16</div>
                <div className="preview-stat-label">Hoàn thành</div>
              </div>
              <div className="preview-stat-item">
                <div className="preview-stat-value" style={{ color: '#F59E0B' }}>8</div>
                <div className="preview-stat-label">Đang thực hiện</div>
              </div>
            </div>

            <div className="hero-features">
              <div className="hero-feature-item">
                <CheckCircleOutlined className="hero-feature-icon" />
                <span>Cơ cấu công việc trực quan</span>
              </div>
              <div className="hero-feature-item">
                <CheckCircleOutlined className="hero-feature-icon" />
                <span>Theo dõi tiến độ theo thời gian</span>
              </div>
              <div className="hero-feature-item">
                <CheckCircleOutlined className="hero-feature-icon" />
                <span>Quản lý công việc theo WBS</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-footer">
          © 2026 CONSTRUCTFLOW. Nền tảng điều hành thi công công trình.
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="login-panel">
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <LoginForm />
        </div>

        <div className="login-copyright">
          © 2026 Nền tảng điều hành thi công công trình • Phiên bản Demo 1.0
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
