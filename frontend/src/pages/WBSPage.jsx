import React, { useState, useMemo } from 'react';
import { Button, Modal, message } from 'antd';
import { PlusOutlined, DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import ProjectHeroCard from '../components/wbs/ProjectHeroCard';
import WbsStats from '../components/wbs/WbsStats';
import WbsToolbar from '../components/wbs/WbsToolbar';
import WbsTreeTable from '../components/wbs/WbsTreeTable';
import WorkDetailDrawer from '../components/wbs/WorkDetailDrawer';
import WorkFormModal from '../components/wbs/WorkFormModal';
import EmptyWbs from '../components/wbs/EmptyWbs';

import { PROJECTS } from '../data/projects';
import { INITIAL_WBS_DATA } from '../data/wbsData';
import {
  calculateStats,
  getAllNodeKeys,
  filterTreeData,
  findNodeById,
  addNodeToTree,
  updateNodeInTree,
  deleteNodeFromTree
} from '../utils/wbsUtils';

const WBSPage = () => {
  // Active Project ID
  const [selectedProjectId, setSelectedProjectId] = useState('DA-001');

  // Master WBS Data per Project
  const [allWbsData, setAllWbsData] = useState(INITIAL_WBS_DATA);

  // Search & Filter State
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Expanded Tree Keys State
  const [expandedKeys, setExpandedKeys] = useState(() => {
    return getAllNodeKeys(INITIAL_WBS_DATA['DA-001'] || []);
  });

  // Selected Node State (Drawer & Highlight)
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalIsEdit, setModalIsEdit] = useState(false);
  const [modalInitialValues, setModalInitialValues] = useState(null);

  // Active Project Object
  const currentProject = useMemo(() => {
    return PROJECTS.find(p => p.id === selectedProjectId) || PROJECTS[0];
  }, [selectedProjectId]);

  // Current Raw WBS Tree for Active Project
  const rawTreeNodes = useMemo(() => {
    return allWbsData[selectedProjectId] || [];
  }, [allWbsData, selectedProjectId]);

  // Filtered Tree & Auto-Expanded Keys
  const { filteredNodes, matchingKeys } = useMemo(() => {
    return filterTreeData(rawTreeNodes, searchText, statusFilter);
  }, [rawTreeNodes, searchText, statusFilter]);

  // Effective Expanded Keys (Includes search matching keys if filtered)
  const effectiveExpandedKeys = useMemo(() => {
    if (searchText || (statusFilter && statusFilter !== 'ALL')) {
      return Array.from(new Set([...expandedKeys, ...matchingKeys]));
    }
    return expandedKeys;
  }, [expandedKeys, matchingKeys, searchText, statusFilter]);

  // Calculated Stats (Strictly for TASK nodes)
  const stats = useMemo(() => {
    return calculateStats(rawTreeNodes);
  }, [rawTreeNodes]);

  // Handle Project Switch
  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    setSearchText('');
    setStatusFilter('ALL');
    setSelectedNodeId(null);
    setDrawerVisible(false);

    const newTree = allWbsData[projectId] || [];
    setExpandedKeys(getAllNodeKeys(newTree));
  };

  // Toggle Row Expansion
  const handleToggleExpand = (nodeId) => {
    setExpandedKeys(prev => {
      if (prev.includes(nodeId)) {
        return prev.filter(k => k !== nodeId);
      } else {
        return [...prev, nodeId];
      }
    });
  };

  // Expand All
  const handleExpandAll = () => {
    const allKeys = getAllNodeKeys(rawTreeNodes);
    setExpandedKeys(allKeys);
    message.info('Đã mở rộng tất cả các nhánh cây WBS');
  };

  // Collapse All
  const handleCollapseAll = () => {
    setExpandedKeys([]);
    message.info('Đã thu gọn tất cả cây WBS');
  };

  // Clear Search & Filter
  const handleClearFilters = () => {
    setSearchText('');
    setStatusFilter('ALL');
  };

  // Select Node & Open Drawer
  const handleSelectNode = (node) => {
    setSelectedNodeId(node.id);
    setDrawerVisible(true);
  };

  // Open Add Task Modal (Root or General)
  const handleOpenAddModal = (parent = null) => {
    setModalIsEdit(false);
    if (parent) {
      setModalInitialValues({
        parentId: parent.id,
        wbsCode: `${parent.wbsCode}.${(parent.children?.length || 0) + 1}`
      });
    } else {
      setModalInitialValues(null);
    }
    setModalVisible(true);
  };

  // Open Edit Task Modal
  const handleOpenEditModal = (node) => {
    setModalIsEdit(true);
    setModalInitialValues(node);
    setModalVisible(true);
  };

  // Delete Confirmation Modal
  const handleDeleteNodeConfirm = (node) => {
    const hasChildren = node.children && node.children.length > 0;

    Modal.confirm({
      title: 'Xóa công việc?',
      icon: <ExclamationCircleOutlined style={{ color: '#DC2626' }} />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa công việc <strong>"{node.name}"</strong>?</p>
          {hasChildren && (
            <div style={{ color: '#DC2626', fontWeight: 600, marginTop: 8 }}>
              ⚠️ Warning: Công việc này có công việc con. Toàn bộ công việc con cũng sẽ bị xóa.
            </div>
          )}
        </div>
      ),
      okText: 'Xóa công việc',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        const updatedTree = deleteNodeFromTree(rawTreeNodes, node.id);
        setAllWbsData(prev => ({
          ...prev,
          [selectedProjectId]: updatedTree
        }));

        if (selectedNodeId === node.id) {
          setSelectedNodeId(null);
          setDrawerVisible(false);
        }

        message.success('Xóa công việc thành công');
      }
    });
  };

  // Submit Form (Add or Edit)
  const handleFormSubmit = (formData) => {
    if (modalIsEdit) {
      // Edit
      const updatedTree = updateNodeInTree(rawTreeNodes, formData);
      setAllWbsData(prev => ({
        ...prev,
        [selectedProjectId]: updatedTree
      }));
      message.success('Cập nhật công việc thành công');
    } else {
      // Add
      const newNode = {
        ...formData,
        id: `task-${Date.now()}`,
        children: []
      };

      const updatedTree = addNodeToTree(rawTreeNodes, newNode, formData.parentId);
      setAllWbsData(prev => ({
        ...prev,
        [selectedProjectId]: updatedTree
      }));

      // Auto expand parent
      if (formData.parentId) {
        setExpandedKeys(prev => Array.from(new Set([...prev, formData.parentId])));
      }

      message.success('Thêm công việc thành công');
    }

    setModalVisible(false);
  };

  // Flattened Parent Options for Modal Select
  const parentOptions = useMemo(() => {
    const options = [];
    const traverse = (items) => {
      items.forEach(item => {
        options.push({ id: item.id, name: item.name, wbsCode: item.wbsCode });
        if (item.children && item.children.length > 0) {
          traverse(item.children);
        }
      });
    };
    traverse(rawTreeNodes);
    return options;
  }, [rawTreeNodes]);

  // Selected Node Object for Drawer
  const activeSelectedNode = useMemo(() => {
    return findNodeById(rawTreeNodes, selectedNodeId);
  }, [rawTreeNodes, selectedNodeId]);

  // Parent Name for Drawer
  const activeParentName = useMemo(() => {
    if (!activeSelectedNode || !activeSelectedNode.parentId) return null;
    const parent = findNodeById(rawTreeNodes, activeSelectedNode.parentId);
    return parent ? `${parent.wbsCode} - ${parent.name}` : null;
  }, [rawTreeNodes, activeSelectedNode]);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Cây cơ cấu công việc</h1>
          <p className="page-subtitle">
            Quản lý và theo dõi cấu trúc phân rã công việc (Work Breakdown Structure) của dự án
          </p>
        </div>

        <div className="page-actions">
          <Button
            icon={<DownloadOutlined />}
            onClick={() => message.info('Chức năng xuất dữ liệu (Demo UI)')}
          >
            Xuất dữ liệu
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenAddModal(null)}
          >
            + Thêm công việc
          </Button>
        </div>
      </div>

      {/* Project Info Bar */}
      <ProjectHeroCard project={currentProject} />

      {/* Statistics Cards */}
      <WbsStats stats={stats} />

      {/* Main WBS Card */}
      <div className="wbs-main-card">
        <div className="wbs-card-header">
          <div className="wbs-card-title-box">
            <span className="wbs-card-title">Cơ cấu phân rã công việc</span>
            <span className="wbs-card-subtitle">Work Breakdown Structure (WBS)</span>
          </div>
        </div>

        {/* Toolbar */}
        <WbsToolbar
          selectedProjectId={selectedProjectId}
          onSelectProject={handleSelectProject}
          searchText={searchText}
          onSearchChange={setSearchText}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
          onClearFilters={handleClearFilters}
        />

        {/* Tree Table or Empty State */}
        {rawTreeNodes.length === 0 ? (
          <EmptyWbs onCreateFirstTask={() => handleOpenAddModal(null)} />
        ) : (
          <WbsTreeTable
            nodes={filteredNodes}
            expandedKeys={effectiveExpandedKeys}
            onToggleExpand={handleToggleExpand}
            selectedNodeId={selectedNodeId}
            onSelectNode={handleSelectNode}
            onViewDetails={(node) => {
              setSelectedNodeId(node.id);
              setDrawerVisible(true);
            }}
            onAddChild={(node) => handleOpenAddModal(node)}
            onEditNode={(node) => handleOpenEditModal(node)}
            onDeleteNode={(node) => handleDeleteNodeConfirm(node)}
          />
        )}
      </div>

      {/* Detail Drawer */}
      <WorkDetailDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        node={activeSelectedNode}
        parentName={activeParentName}
        onAddChild={(node) => {
          setDrawerVisible(false);
          handleOpenAddModal(node);
        }}
        onEditNode={(node) => {
          setDrawerVisible(false);
          handleOpenEditModal(node);
        }}
        onDeleteNode={(node) => {
          handleDeleteNodeConfirm(node);
        }}
      />

      {/* Add / Edit Form Modal */}
      <WorkFormModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleFormSubmit}
        initialValues={modalInitialValues}
        parentOptions={parentOptions}
        isEdit={modalIsEdit}
      />
    </div>
  );
};

export default WBSPage;
