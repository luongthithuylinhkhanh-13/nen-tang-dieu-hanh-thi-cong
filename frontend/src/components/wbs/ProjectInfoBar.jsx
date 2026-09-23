import React from 'react';
import { Tag, Progress } from 'antd';
import dayjs from 'dayjs';

const ProjectInfoBar = ({ project }) => {
  if (!project) return null;

  return (
    <div className="project-info-bar">
      <div className="project-info-left">
        <span className="project-badge">{project.code}</span>
        <div>
          <span style={{ fontSize: 11, color: '#667085', display: 'block' }}>DỰ ÁN ĐANG CHỌN</span>
          <span className="project-title">{project.name}</span>
        </div>
        <Tag color="processing" style={{ marginLeft: 8 }}>
          {project.statusLabel || 'Đang thi công'}
        </Tag>
      </div>

      <div className="project-info-right">
        <div className="project-meta-item">
          <span className="meta-label">Ngày bắt đầu</span>
          <span className="meta-value">
            {project.startDate ? dayjs(project.startDate).format('DD/MM/YYYY') : '--'}
          </span>
        </div>

        <div className="project-meta-item">
          <span className="meta-label">Ngày dự kiến</span>
          <span className="meta-value">
            {project.endDate ? dayjs(project.endDate).format('DD/MM/YYYY') : '--'}
          </span>
        </div>

        <div className="project-progress-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 2 }}>
            <span style={{ color: '#667085' }}>Tiến độ tổng</span>
            <span style={{ fontWeight: 700, color: '#2563EB' }}>{project.progress}%</span>
          </div>
          <Progress percent={project.progress} showInfo={false} strokeColor="#2563EB" size="small" />
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoBar;
