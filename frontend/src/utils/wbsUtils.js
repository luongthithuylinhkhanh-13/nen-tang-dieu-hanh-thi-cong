/**
 * Recalculates progress for Phase and Project nodes based on child tasks average.
 */
export const recalculateTreeProgress = (nodes) => {
  if (!nodes || !nodes.length) return [];

  return nodes.map(node => {
    if (!node.children || node.children.length === 0) {
      return { ...node };
    }

    const updatedChildren = recalculateTreeProgress(node.children);
    
    // Collect all descendant tasks under this node
    const getTaskNodes = (items) => {
      let tasks = [];
      items.forEach(item => {
        if (item.type === 'task') {
          tasks.push(item);
        }
        if (item.children && item.children.length > 0) {
          tasks = tasks.concat(getTaskNodes(item.children));
        }
      });
      return tasks;
    };

    const descendantTasks = getTaskNodes(updatedChildren);
    let avgProgress = node.progress;

    if (descendantTasks.length > 0) {
      const sum = descendantTasks.reduce((acc, t) => acc + (Number(t.progress) || 0), 0);
      avgProgress = Math.round(sum / descendantTasks.length);
    } else {
      // If phase has only child phases or nodes, average child progress directly
      const sum = updatedChildren.reduce((acc, c) => acc + (Number(c.progress) || 0), 0);
      avgProgress = Math.round(sum / updatedChildren.length);
    }

    // Determine status if completed
    let status = node.status;
    if (avgProgress === 100) status = 'completed';
    else if (avgProgress > 0 && status === 'not_started') status = 'in_progress';

    return {
      ...node,
      progress: avgProgress,
      status,
      children: updatedChildren
    };
  });
};

/**
 * Calculates statistics for TASK nodes only (excluding project/phase nodes).
 */
export const calculateStats = (nodes) => {
  let totalTasks = 0;
  let inProgress = 0;
  let completed = 0;
  let notStarted = 0;
  let paused = 0;

  const traverse = (items) => {
    if (!items || !items.length) return;
    items.forEach(item => {
      if (item.type === 'task') {
        totalTasks += 1;
        if (item.status === 'completed') completed += 1;
        else if (item.status === 'in_progress') inProgress += 1;
        else if (item.status === 'paused') paused += 1;
        else notStarted += 1;
      }
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
    });
  };

  traverse(nodes);

  return {
    totalTasks,
    inProgress,
    completed,
    notStarted,
    paused
  };
};

/**
 * Finds a node by ID in the tree hierarchy.
 */
export const findNodeById = (nodes, id) => {
  if (!nodes || !nodes.length) return null;
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Returns all node IDs to handle Expand All / Collapse All.
 */
export const getAllNodeKeys = (nodes) => {
  let keys = [];
  if (!nodes || !nodes.length) return keys;

  const traverse = (items) => {
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        keys.push(item.id);
        traverse(item.children);
      }
    });
  };

  traverse(nodes);
  return keys;
};

/**
 * Adds a new node under parentId or at root.
 */
export const addNodeToTree = (nodes, newNode, parentId) => {
  if (!parentId) {
    return recalculateTreeProgress([...nodes, newNode]);
  }

  const insert = (items) => {
    return items.map(item => {
      if (item.id === parentId) {
        return {
          ...item,
          children: [...(item.children || []), newNode]
        };
      }
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: insert(item.children)
        };
      }
      return item;
    });
  };

  const updated = insert(nodes);
  return recalculateTreeProgress(updated);
};

/**
 * Updates an existing node by ID.
 */
export const updateNodeInTree = (nodes, updatedNode) => {
  const update = (items) => {
    return items.map(item => {
      if (item.id === updatedNode.id) {
        return {
          ...item,
          ...updatedNode,
          children: item.children // preserve existing children
        };
      }
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: update(item.children)
        };
      }
      return item;
    });
  };

  const updated = update(nodes);
  return recalculateTreeProgress(updated);
};

/**
 * Deletes a node by ID from tree.
 */
export const deleteNodeFromTree = (nodes, targetId) => {
  const remove = (items) => {
    return items
      .filter(item => item.id !== targetId)
      .map(item => {
        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: remove(item.children)
          };
        }
        return item;
      });
  };

  const updated = remove(nodes);
  return recalculateTreeProgress(updated);
};

/**
 * Filters the tree by search query & status filter while keeping parent path intact.
 */
export const filterTreeData = (nodes, searchText = '', statusFilter = 'ALL') => {
  if (!searchText && (!statusFilter || statusFilter === 'ALL')) {
    return { filteredNodes: nodes, matchingKeys: [] };
  }

  const query = searchText.trim().toLowerCase();
  const keysToExpand = new Set();

  const filterNode = (node) => {
    const matchesSearch = !query || 
      (node.wbsCode && node.wbsCode.toLowerCase().includes(query)) ||
      (node.name && node.name.toLowerCase().includes(query));

    const matchesStatus = !statusFilter || statusFilter === 'ALL' || node.status === statusFilter;

    // Filter children recursively
    let filteredChildren = [];
    if (node.children && node.children.length > 0) {
      filteredChildren = node.children.map(filterNode).filter(Boolean);
    }

    const isDirectMatch = matchesSearch && matchesStatus;

    if (isDirectMatch || filteredChildren.length > 0) {
      if (filteredChildren.length > 0) {
        keysToExpand.add(node.id);
      }
      return {
        ...node,
        children: filteredChildren
      };
    }

    return null;
  };

  const result = nodes.map(filterNode).filter(Boolean);
  return { filteredNodes: result, matchingKeys: Array.from(keysToExpand) };
};
