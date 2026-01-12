/**
 * ダッシュボードページのJavaScript制御
 * 統計情報の更新、クイックアクション機能を提供
 */

document.addEventListener('DOMContentLoaded', function() {
    // 統計情報の自動更新（オプション）
    // 定期的に統計情報を更新する場合は以下のコメントを解除
    // setInterval(updateStatistics, 30000); // 30秒ごとに更新
    
    // クイックアクションボタンのイベントハンドラ
    const quickActionButtons = document.querySelectorAll('.btn-outline-primary, .btn-outline-success, .btn-outline-info, .btn-outline-warning');
    quickActionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // クリック時の視覚的フィードバック
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        });
    });
    
    /**
     * 統計情報を更新（REST APIが実装されている場合）
     */
    async function updateStatistics() {
        try {
            const response = await apiClient.get('/api/dashboard/statistics');
            
            if (response.status === 200 && response.data) {
                const stats = response.data;
                
                // 統計情報を更新
                updateStatCard('totalProjects', stats.totalProjects);
                updateStatCard('totalTasks', stats.totalTasks);
                updateStatCard('pendingTasks', stats.pendingTasks);
                updateStatCard('completedTasks', stats.completedTasks);
            }
        } catch (error) {
            console.error('統計情報の更新エラー:', error);
            // エラー時は静かに失敗（ユーザーに通知しない）
        }
    }
    
    /**
     * 統計カードを更新
     */
    function updateStatCard(statName, value) {
        const card = document.querySelector(`[data-stat="${statName}"]`);
        if (card) {
            const numberElement = card.querySelector('h4.card-title');
            if (numberElement) {
                // アニメーション効果
                const currentValue = parseInt(numberElement.textContent) || 0;
                animateNumber(numberElement, currentValue, value, 500);
            }
        }
    }
    
    /**
     * 数値のアニメーション
     */
    function animateNumber(element, from, to, duration) {
        const startTime = performance.now();
        const difference = to - from;
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.round(from + difference * progress);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
});


