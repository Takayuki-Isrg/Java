/**
 * タスク一覧ページのJavaScript制御
 * 検索、フィルタリング、非同期データ取得機能を提供
 */

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchKeyword');
    const assigneeFilter = document.getElementById('filterAssignee');
    const priorityFilter = document.getElementById('filterPriority');
    const statusFilter = document.getElementById('filterStatus');
    const searchButton = document.getElementById('searchButton');
    const taskTableBody = document.getElementById('taskTableBody');
    
    // フィルタ条件
    let currentFilters = {
        keyword: '',
        assignee: '',
        priority: '',
        status: ''
    };
    
    // 検索ボタンのクリックイベント
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            applyFilters();
        });
    }
    
    // Enterキーで検索
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyFilters();
            }
        });
    }
    
    // フィルタの変更イベント（リアルタイム検索の場合）
    [assigneeFilter, priorityFilter, statusFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', function() {
                // リアルタイム検索を有効にする場合はコメントを解除
                // applyFilters();
            });
        }
    });
    
    /**
     * フィルタを適用
     */
    function applyFilters() {
        currentFilters = {
            keyword: searchInput ? searchInput.value.trim() : '',
            assignee: assigneeFilter ? assigneeFilter.value : '',
            priority: priorityFilter ? priorityFilter.value : '',
            status: statusFilter ? statusFilter.value : ''
        };
        
        // クライアント側フィルタリング（既存のテーブル行をフィルタ）
        filterTasks();
        
        // サーバー側からデータを取得する場合は以下のコメントを解除
        // loadTasks(currentFilters);
    }
    
    /**
     * クライアント側でのタスクフィルタリング
     */
    function filterTasks() {
        const rows = taskTableBody.querySelectorAll('tr');
        let visibleCount = 0;
        
        rows.forEach(row => {
            // 空のメッセージ行はスキップ
            if (row.querySelector('td[colspan]')) {
                return;
            }
            
            let showRow = true;
            
            // キーワード検索
            if (currentFilters.keyword) {
                const title = row.querySelector('td:first-child')?.textContent.toLowerCase() || '';
                if (!title.includes(currentFilters.keyword.toLowerCase())) {
                    showRow = false;
                }
            }
            
            // 担当者フィルタ
            if (currentFilters.assignee && showRow) {
                const assignee = row.querySelector('td:nth-child(2)')?.textContent.trim() || '';
                if (assignee !== currentFilters.assignee) {
                    showRow = false;
                }
            }
            
            // 優先度フィルタ
            if (currentFilters.priority && showRow) {
                const priorityBadge = row.querySelector('td:nth-child(4) .badge');
                if (priorityBadge) {
                    const priorityText = priorityBadge.textContent.trim().toUpperCase();
                    const priorityMap = {
                        'HIGH': 'HIGH',
                        'MEDIUM': 'MEDIUM',
                        'LOW': 'LOW'
                    };
                    if (priorityMap[priorityText] !== currentFilters.priority) {
                        showRow = false;
                    }
                }
            }
            
            // ステータスフィルタ
            if (currentFilters.status && showRow) {
                const statusText = row.querySelector('td:nth-child(5)')?.textContent.trim() || '';
                const statusMap = {
                    'TODO': '未着手',
                    'IN_PROGRESS': '進行中',
                    'DONE': '完了'
                };
                if (statusText !== statusMap[currentFilters.status]) {
                    showRow = false;
                }
            }
            
            row.style.display = showRow ? '' : 'none';
            if (showRow) {
                visibleCount++;
            }
        });
        
        // 表示される行がない場合のメッセージ
        if (visibleCount === 0 && rows.length > 0) {
            const emptyRow = taskTableBody.querySelector('tr[th\\:if*="isEmpty"]');
            if (emptyRow) {
                emptyRow.style.display = '';
                emptyRow.querySelector('td').textContent = '検索条件に一致するタスクが見つかりませんでした。';
            }
        } else {
            const emptyRow = taskTableBody.querySelector('tr[th\\:if*="isEmpty"]');
            if (emptyRow) {
                emptyRow.style.display = 'none';
            }
        }
    }
    
    /**
     * サーバーからタスクを取得（REST APIが実装されている場合）
     */
    async function loadTasks(filters) {
        try {
            const params = new URLSearchParams();
            if (filters.keyword) params.append('keyword', filters.keyword);
            if (filters.assignee) params.append('assignee', filters.assignee);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.status) params.append('status', filters.status);
            
            const response = await apiClient.get(`/api/tasks?${params.toString()}`);
            
            if (response.status === 200 && response.data) {
                renderTasks(response.data);
            }
        } catch (error) {
            console.error('タスク取得エラー:', error);
            if (error.status !== 404) {
                showErrorMessage('タスクの取得に失敗しました');
            }
        }
    }
    
    /**
     * タスクをテーブルに表示
     */
    function renderTasks(tasks) {
        taskTableBody.innerHTML = '';
        
        if (tasks.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="6" class="text-center text-muted py-4">
                    まだタスクが登録されていません。
                </td>
            `;
            taskTableBody.appendChild(emptyRow);
            return;
        }
        
        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${escapeHtml(task.title || '')}</td>
                <td>${escapeHtml(task.assignee?.displayName || '未割り当て')}</td>
                <td>${task.dueDate ? formatDate(task.dueDate) : '-'}</td>
                <td>
                    <span class="badge ${getPriorityBadgeClass(task.priority)}">
                        ${getPriorityLabel(task.priority)}
                    </span>
                </td>
                <td>
                    <span class="badge ${getStatusBadgeClass(task.status)}">
                        ${getStatusLabel(task.status)}
                    </span>
                </td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary btn-view-task" data-task-id="${task.id}">
                        詳細
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-delete-task" data-task-id="${task.id}">
                        削除
                    </button>
                </td>
            `;
            taskTableBody.appendChild(row);
        });
    }
    
    /**
     * タスク削除
     */
    taskTableBody.addEventListener('click', async function(e) {
        if (e.target.classList.contains('btn-delete-task') || 
            e.target.closest('.btn-delete-task')) {
            e.preventDefault();
            const button = e.target.classList.contains('btn-delete-task') ? 
                          e.target : e.target.closest('.btn-delete-task');
            const taskId = button.dataset.taskId;
            
            if (taskId && confirm('このタスクを削除してもよろしいですか？')) {
                await deleteTask(taskId, button);
            }
        }
    });
    
    /**
     * タスクを削除
     */
    async function deleteTask(taskId, button) {
        const originalButtonText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
        
        try {
            const response = await apiClient.delete(`/api/tasks/${taskId}`);
            
            if (response.status === 200 || response.status === 204) {
                showSuccessMessage('タスクを削除しました');
                const row = button.closest('tr');
                if (row) {
                    row.style.transition = 'opacity 0.3s';
                    row.style.opacity = '0';
                    setTimeout(() => {
                        row.remove();
                        // テーブルが空になった場合の処理
                        if (taskTableBody.querySelectorAll('tr').length === 0) {
                            const emptyRow = document.createElement('tr');
                            emptyRow.innerHTML = `
                                <td colspan="6" class="text-center text-muted py-4">
                                    まだタスクが登録されていません。
                                </td>
                            `;
                            taskTableBody.appendChild(emptyRow);
                        }
                    }, 300);
                }
            }
        } catch (error) {
            console.error('タスク削除エラー:', error);
            if (error.status === 403) {
                showErrorMessage('このタスクを削除する権限がありません');
            } else if (error.status === 404) {
                showErrorMessage('タスクが見つかりませんでした');
            } else {
                showErrorMessage(error.message || 'タスクの削除に失敗しました');
            }
            button.disabled = false;
            button.innerHTML = originalButtonText;
        }
    }
    
    /**
     * 優先度のバッジクラスを取得
     */
    function getPriorityBadgeClass(priority) {
        const map = {
            'HIGH': 'bg-danger',
            'MEDIUM': 'bg-warning',
            'LOW': 'bg-secondary'
        };
        return map[priority] || 'bg-secondary';
    }
    
    /**
     * 優先度のラベルを取得
     */
    function getPriorityLabel(priority) {
        const map = {
            'HIGH': '高',
            'MEDIUM': '中',
            'LOW': '低'
        };
        return map[priority] || priority;
    }
    
    /**
     * ステータスのバッジクラスを取得
     */
    function getStatusBadgeClass(status) {
        const map = {
            'TODO': 'bg-secondary',
            'IN_PROGRESS': 'bg-primary',
            'DONE': 'bg-success'
        };
        return map[status] || 'bg-secondary';
    }
    
    /**
     * ステータスのラベルを取得
     */
    function getStatusLabel(status) {
        const map = {
            'TODO': '未着手',
            'IN_PROGRESS': '進行中',
            'DONE': '完了'
        };
        return map[status] || status;
    }
    
    /**
     * 日付をフォーマット
     */
    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP');
    }
    
    /**
     * HTMLエスケープ
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});


