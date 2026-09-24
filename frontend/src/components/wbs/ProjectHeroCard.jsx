import React from 'react';
import { Card, Tag, Progress, Avatar, Image } from 'antd';
import dayjs from 'dayjs';
import { UserOutlined } from '@ant-design/icons';

// Hero image placeholder – using CSS gradient background
// No external image URL to avoid broken image

const ProjectHeroCard = ({ project }) => {
  if (!project) return null;

  return (
    <Card
      className="project-hero-card"
      bordered={false}
      style={{ minHeight: '130px', display: 'flex', alignItems: 'center', padding: '16px' }}
    >
      <div className="hero-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="hero-left" style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src={project.image || '/images/construction/project.png'}
            width={180}
            height={100}
            style={{ borderRadius: 8, marginRight: 16, objectFit: 'cover' }}
            preview={false}
            fallback={<div style={{ width: 180, height: 100, background: 'linear-gradient(135deg, #3c6382, #0a3d62)', borderRadius: 8, marginRight: 16 }} />}
          />
          <div className="hero-info">
            <Tag color="processing" style={{ marginBottom: 8 }}>{project.code}</Tag>
            <h2 className="hero-title" style={{ margin: 0 }}>{project.name}</h2>
            <div className="hero-meta">
              <span className="meta-label">Trạng thái:</span>{' '}
              <Tag color="processing">{project.statusLabel || 'Đang thi công'}</Tag>
            </div>
            <div className="hero-meta">
              <span className="meta-label">Thời gian:</span>{' '}
              <span>{dayjs(project.startDate).format('DD/MM/YYYY')} - {dayjs(project.endDate).format('DD/MM/YYYY')}</span>
            </div>
          </div>
        </div>
        <div className="hero-right" style={{ textAlign: 'right' }}>
          <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: 'var(--primary-blue)' }} />
          <div className="progress-block" style={{ marginTop: 8 }}>
            <span className="progress-label" style={{ fontSize: 12, color: '#667085' }}>Tiến độ</span>
            <Progress percent={project.progress} size="small" strokeColor="var(--primary-blue)" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectHeroCard;
