/**
 * プロジェクト一覧ページのJavaScript制御
 * フィルタリング、検索、削除機能を提供
 */

document.addEventListener('DOMContentLoaded', function() {
    const table = document.querySelector('table');
    const tbody = table.querySelector('tbody');
    
    // 検索・フィルタリング機能（今後実装予定のUI要素に対応）
    const searchInput = document.querySelector('input[type="text"][placeholder*="検索"]');
    const statusFilter = document.querySelector('select[name="status"]');
    
    // 検索機能
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterProjects();
        });
    }
    
    // ステータスフィルタ
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterProjects();
        });
    }
    
    /**
     * プロジェクトのフィルタリング
     */
    function filterProjects() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const statusValue = statusFilter ? statusFilter.value : '';
        const rows = tbody.querySelectorAll('tr');
        
        rows.forEach(row => {
            if (row.querySelector('td[colspan]')) {
                // 空のメッセージ行は常に表示
                return;
            }
            
            let showRow = true;
            
            // 検索フィルタ
            if (searchTerm) {
                const projectName = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
                const projectId = row.querySelector('td:nth-child(1)')?.textContent.toLowerCase() || '';
                if (!projectName.includes(searchTerm) && !projectId.includes(searchTerm)) {
                    showRow = false;
                }
            }
            
            // ステータスフィルタ
            if (statusValue && showRow) {
                const statusBadge = row.querySelector('.badge');
                if (statusBadge) {
                    const statusText = statusBadge.textContent.trim();
                    const statusMap = {
                        '進行中': 'ACTIVE',
                        '完了': 'COMPLETED',
                        '保留': 'ON_HOLD',
                        'アーカイブ': 'ARCHIVED'
                    };
                    const rowStatus = Object.keys(statusMap).find(key => statusText === key);
                    if (rowStatus && statusMap[rowStatus] !== statusValue) {
                        showRow = false;
                    }
                }
            }
            
            row.style.display = showRow ? '' : 'none';
        });
        
        // 表示される行がない場合のメッセージ
        const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none');
        if (visibleRows.length === 0 && rows.length > 0) {
            // 空のメッセージ行を表示
            const emptyRow = tbody.querySelector('tr[th\\:if*="isEmpty"]');
            if (emptyRow) {
                emptyRow.style.display = '';
                emptyRow.querySelector('td').textContent = '検索条件に一致するプロジェクトが見つかりませんでした。';
            }
        }
    }
    
    // 削除機能（削除ボタンが追加された場合に対応）
    tbody.addEventListener('click', async function(e) {
        if (e.target.classList.contains('btn-delete-project') || 
            e.target.closest('.btn-delete-project')) {
            e.preventDefault();
            const button = e.target.classList.contains('btn-delete-project') ? 
                          e.target : e.target.closest('.btn-delete-project');
            const projectId = button.dataset.projectId;
            
            if (projectId && confirm('このプロジェクトを削除してもよろしいですか？')) {
                await deleteProject(projectId, button);
            }
        }
    });
    
    /**
     * プロジェクトの削除
     */
    async function deleteProject(projectId, button) {
        const originalButtonText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
        
        try {
            const response = await apiClient.delete(`/projects/${projectId}`);
            
            if (response.status === 200 || response.status === 204) {
                showSuccessMessage('プロジェクトを削除しました');
                // 行を削除
                const row = button.closest('tr');
                if (row) {
                    row.style.transition = 'opacity 0.3s';
                    row.style.opacity = '0';
                    setTimeout(() => {
                        row.remove();
                        // テーブルが空になった場合の処理
                        if (tbody.querySelectorAll('tr').length === 0) {
                            const emptyRow = document.createElement('tr');
                            emptyRow.innerHTML = `
                                <td colspan="6" class="text-center text-muted py-4">
                                    まだプロジェクトが登録されていません。
                                </td>
                            `;
                            tbody.appendChild(emptyRow);
                        }
                    }, 300);
                }
            }
        } catch (error) {
            console.error('プロジェクト削除エラー:', error);
            if (error.status === 403) {
                showErrorMessage('このプロジェクトを削除する権限がありません');
            } else if (error.status === 404) {
                showErrorMessage('プロジェクトが見つかりませんでした');
            } else {
                showErrorMessage(error.message || 'プロジェクトの削除に失敗しました');
            }
            button.disabled = false;
            button.innerHTML = originalButtonText;
        }
    }
    
    // テーブルの行にホバー効果を追加
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
        if (!row.querySelector('td[colspan]')) {
            row.style.cursor = 'pointer';
            row.addEventListener('click', function(e) {
                // ボタンクリックの場合は行のクリックイベントを無視
                if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                    return;
                }
                // 詳細ページへの遷移（今後実装）
                const projectId = row.querySelector('td:first-child')?.textContent;
                if (projectId) {
                    // window.location.href = `/projects/${projectId}`;
                }
            });
        }
    });
});


