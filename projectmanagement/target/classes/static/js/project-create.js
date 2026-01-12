/**
 * プロジェクト作成フォームのJavaScript制御
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form[th\\:action*="/projects"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const nameInput = document.getElementById('name');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    // フォーム送信の非同期処理
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // バリデーション
        if (!validateForm()) {
            return;
        }
        
        // 送信ボタンを無効化
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 作成中...';
        
        try {
            // フォームデータを送信
            await submitFormAsync(
                form,
                form.action || '/projects',
                'POST',
                function(response) {
                    // 成功時の処理
                    showSuccessMessage('プロジェクトを作成しました');
                    // 1秒後にダッシュボードにリダイレクト
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1000);
                },
                function(error) {
                    // エラー時の処理
                    if (error.status === 400 || error.status === 422) {
                        // バリデーションエラー
                        const errorMessage = error.message || '入力内容に誤りがあります。';
                        showErrorMessage(errorMessage);
                        
                        // フィールドエラーを表示
                        if (error.data && error.data.errors) {
                            error.data.errors.forEach(err => {
                                const field = document.getElementById(err.field || err.fieldName);
                                if (field) {
                                    field.classList.add('is-invalid');
                                    const feedback = document.createElement('div');
                                    feedback.className = 'invalid-feedback';
                                    feedback.textContent = err.defaultMessage || err.message;
                                    field.parentNode.appendChild(feedback);
                                }
                            });
                        }
                    } else {
                        showErrorMessage(error.message || 'プロジェクトの作成に失敗しました');
                    }
                }
            );
        } catch (error) {
            console.error('予期しないエラー:', error);
            showErrorMessage('予期しないエラーが発生しました');
        } finally {
            // 送信ボタンを再有効化
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
    
    // 日付のバリデーション：終了日が開始日より前でないかチェック
    if (startDateInput && endDateInput) {
        endDateInput.addEventListener('change', function() {
            validateDateRange();
        });
        
        startDateInput.addEventListener('change', function() {
            validateDateRange();
        });
    }
    
    // プロジェクト名のリアルタイムバリデーション
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            validateProjectName();
        });
    }
    
    /**
     * フォーム全体のバリデーション
     */
    function validateForm() {
        let isValid = true;
        
        // プロジェクト名のチェック
        if (!validateProjectName()) {
            isValid = false;
        }
        
        // 日付範囲のチェック
        if (!validateDateRange()) {
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * プロジェクト名のバリデーション
     */
    function validateProjectName() {
        const name = nameInput.value.trim();
        const nameField = nameInput.parentElement;
        
        // 既存のエラーメッセージを削除
        const existingError = nameField.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
        nameInput.classList.remove('is-invalid', 'is-valid');
        
        if (!name) {
            nameInput.classList.add('is-invalid');
            const feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.textContent = 'プロジェクト名は必須です';
            nameField.appendChild(feedback);
            return false;
        }
        
        if (name.length > 200) {
            nameInput.classList.add('is-invalid');
            const feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.textContent = 'プロジェクト名は200文字以内で入力してください';
            nameField.appendChild(feedback);
            return false;
        }
        
        nameInput.classList.add('is-valid');
        return true;
    }
    
    /**
     * 日付範囲のバリデーション
     */
    function validateDateRange() {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        const endDateField = endDateInput.parentElement;
        
        // 既存のエラーメッセージを削除
        const existingError = endDateField.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
        endDateInput.classList.remove('is-invalid', 'is-valid');
        
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            if (end < start) {
                endDateInput.classList.add('is-invalid');
                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                feedback.textContent = '終了予定日は開始日より後である必要があります';
                endDateField.appendChild(feedback);
                return false;
            }
        }
        
        if (endDate) {
            endDateInput.classList.add('is-valid');
        }
        return true;
    }
});

