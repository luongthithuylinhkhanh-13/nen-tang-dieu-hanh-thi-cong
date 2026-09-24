import React from 'react';
import { Empty, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const EmptyWbs = ({ onCreateFirstTask }) => {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', background: '#FFFFFF', borderRadius: 10, border: '1px solid #E6EAF0' }}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div>
            <h3 style={{ fontSize: 18, color: '#172B4D', marginBottom: 4 }}>
              Chưa có cơ cấu công việc
            </h3>
            <p style={{ color: '#667085', fontSize: 14 }}>
              Dự án này chưa được thiết lập cây WBS.
            </p>
          </div>
        }
      >
        <Button 
          type="primary" 
          size="large"
          icon={<PlusOutlined />} 
          onClick={onCreateFirstTask}
          style={{ marginTop: 12 }}
        >
          Tạo công việc đầu tiên
        </Button>
      </Empty>
    </div>
  );
};

export default EmptyWbs;
