import React from 'react';
import { Drawer, Tag, Progress, Button, Space, Descriptions, List, Popconfirm, Image } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  FileTextOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const WorkDetailDrawer = ({ 
  visible, 
  onClose, 
  node, 
  parentName,
  onAddChild, 
  onEditNode, 
  onDeleteNode 
}) => {
  if (!node) return null;

  const renderStatusTag = (status) => {
    switch (status) {
      case 'completed':
        return <Tag color="success">Hoàn thành</Tag>;
      case 'in_progress':
        return <Tag color="processing">Đang thực hiện</Tag>;
      case 'paused':
        return <Tag color="warning">Tạm dừng</Tag>;
      case 'not_started':
      default:
        return <Tag color="default">Chưa bắt đầu</Tag>;
    }
  };

  // Duration in days
  const getDurationDays = () => {
    if (!node.startDate || !node.endDate) return '--';
    const start = dayjs(node.startDate);
    const end = dayjs(node.endDate);
    const diff = end.diff(start, 'day') + 1;
    return diff > 0 ? `${diff} ngày` : '--';
  };

  const progressVal = node.progress || 0;
  const remainingVal = 100 - progressVal;

  return (
    <Drawer
      title="CHI TIẾT CÔNG VIỆC"
      placement="right"
      width={520}
      onClose={onClose}
      open={visible}
      className="work-drawer"
      destroyOnClose
    >
      <div className="drawer-content" style={{ paddingBottom: 60 }}>
        {/* Top Header Card */}
        <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 8, border: '1px solid #E6EAF0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="wbs-code-tag">{node.wbsCode}</span>
            {renderStatusTag(node.status)}
          </div>
          <h3 style={{ fontSize: 18, color: '#172B4D', margin: 0 }}>
            {node.name}
          </h3>
        </div>

        {/* Section: Progress */}
        <div>
          <div className="drawer-section-title">TIẾN ĐỘ THI CÔNG</div>
          <div style={{ background: '#FFFFFF', padding: 16, border: '1px solid #E6EAF0', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
              <span>Đã thực hiện: <strong style={{ color: '#2563EB' }}>{progressVal}%</strong></span>
              <span>Còn lại: <strong style={{ color: '#64748B' }}>{remainingVal}%</strong></span>
            </div>
            <Progress 
              percent={progressVal} 
              strokeColor="#2563EB"
              trailColor="#E2E8F0"
              strokeWidth={10}
            />
          </div>
        </div>

        {/* Section: Information Table */}
        <div>
          <div className="drawer-section-title">THÔNG TIN CHI TIẾT</div>
          <Descriptions column={1} bordered size="small" labelStyle={{ width: 140, fontWeight: 600, color: '#475569' }}>
            <Descriptions.Item label="Mã WBS">
              <span className="wbs-code-tag">{node.wbsCode}</span>
            </Descriptions.Item>

            <Descriptions.Item label="Hạng mục cha">
              {parentName || '--'}
            </Descriptions.Item>

            <Descriptions.Item label="Người phụ trách">
              {node.assignee ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <UserOutlined style={{ color: '#2563EB' }} />
                  <span>{node.assignee.name}</span>
                </div>
              ) : (
                <span style={{ color: '#94A3B8' }}>Chưa phân công</span>
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Ngày bắt đầu">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CalendarOutlined style={{ color: '#64748B' }} />
                <span>{node.startDate ? dayjs(node.startDate).format('DD/MM/YYYY') : '--'}</span>
              </div>
            </Descriptions.Item>

            <Descriptions.Item label="Ngày kết thúc">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CalendarOutlined style={{ color: '#64748B' }} />
                <span>{node.endDate ? dayjs(node.endDate).format('DD/MM/YYYY') : '--'}</span>
              </div>
            </Descriptions.Item>

            <Descriptions.Item label="Thời lượng">
              <strong>{getDurationDays()}</strong>
            </Descriptions.Item>

            <Descriptions.Item label="Trạng thái">
              {renderStatusTag(node.status)}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Section: Description */}
        <div>
          <div className="drawer-section-title">MÔ TẢ CÔNG VIỆC</div>
          <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 8, border: '1px solid #E6EAF0', fontSize: 13, color: '#334155' }}>
            <FileTextOutlined style={{ marginRight: 6, color: '#64748B' }} />
            {node.description || 'Chưa có mô tả'}
          </div>
        </div>
        {/* Section: Images */}
        <div>
          <div className="drawer-section-title">HÌNH ẢNH HIỆN TRƯỜNG</div>
          {node.images && node.images.length > 0 ? (
            <Image.PreviewGroup>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {node.images.map((img, idx) => (
                  <Image
                    key={idx}
                    src={typeof img === 'string' ? `/images/construction/${img}` : img.url}
                    width={100}
                    height={80}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                  />
                ))}
              </div>
            </Image.PreviewGroup>
          ) : (
            <div style={{ padding: 12, textAlign: 'center', color: '#94A3B8', border: '1px dashed #CBD5E1', borderRadius: 6, fontSize: 13, marginTop: 8 }}>
              Chưa có hình ảnh hiện trường
            </div>
          )}
        </div>

        {/* Section: Sub-tasks */}
        <div>
          <div className="drawer-section-title">CÔNG VIỆC CON</div>
          {node.children && node.children.length > 0 ? (
            <List
              size="small"
              bordered
              dataSource={node.children}
              renderItem={child => (
                <List.Item>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <div>
                      <span className="wbs-code-tag" style={{ marginRight: 8 }}>{child.wbsCode}</span>
                      <span style={{ fontWeight: 500 }}>{child.name}</span>
                    </div>
                    {renderStatusTag(child.status)}
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div style={{ padding: 12, textAlign: 'center', color: '#94A3B8', border: '1px dashed #CBD5E1', borderRadius: 6, fontSize: 13 }}>
              Chưa có công việc con
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="drawer-sticky-footer">
        <Button 
          icon={<PlusOutlined />} 
          onClick={() => onAddChild(node)}
        >
          Thêm công việc con
        </Button>

        <Space>
          <Button 
            icon={<EditOutlined />} 
            type="primary" 
            onClick={() => onEditNode(node)}
          >
            Chỉnh sửa
          </Button>

          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => onDeleteNode(node)}
          >
            Xóa
          </Button>
        </Space>
      </div>
    </Drawer>
  );
};

export default WorkDetailDrawer;
