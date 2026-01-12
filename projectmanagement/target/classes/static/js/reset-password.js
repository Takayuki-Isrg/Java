/**
 * パスワード再設定フォームのJavaScript制御
 * 非同期送信、バリデーション、エラーハンドリングを提供
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form[action="/reset-password"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const emailInput = document.getElementById('email');
    
    // フォーム送信の非同期処理
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // バリデーション
        if (!validateEmail()) {
            return;
        }
        
        // 送信ボタンを無効化
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 送信中...';
        
        try {
            // フォームデータを送信
            await submitFormAsync(
                form,
                form.action || '/reset-password',
                'POST',
                function(response) {
                    // 成功時の処理
                    showSuccessMessage('パスワード再設定メールを送信しました。メールをご確認ください。');
                    // フォームをリセット
                    form.reset();
                    emailInput.classList.remove('is-valid');
                    
                    // 3秒後にログインページにリダイレクト（オプション）
                    // setTimeout(() => {
                    //     window.location.href = '/login';
                    // }, 3000);
                },
                function(error) {
                    // エラー時の処理
                    if (error.status === 404) {
                        showErrorMessage('このメールアドレスは登録されていません');
                    } else if (error.status === 400) {
                        showErrorMessage('メールアドレスの形式が正しくありません');
                    } else if (error.status === 500) {
                        showErrorMessage('メール送信に失敗しました。しばらくしてから再度お試しください');
                    } else {
                        showErrorMessage(error.message || 'パスワード再設定メールの送信に失敗しました');
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
    
    // メールアドレスのリアルタイムバリデーション
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmail();
        });
        
        emailInput.addEventListener('input', function() {
            // 入力中はエラー表示をクリア
            if (emailInput.classList.contains('is-invalid')) {
                const existingError = emailInput.parentElement.querySelector('.invalid-feedback');
                if (existingError) {
                    existingError.remove();
                }
                emailInput.classList.remove('is-invalid');
            }
        });
    }
    
    /**
     * メールアドレスのバリデーション
     */
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailField = emailInput.parentElement;
        
        // 既存のエラーメッセージを削除
        const existingError = emailField.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
        emailInput.classList.remove('is-invalid', 'is-valid');
        
        if (!email) {
            emailInput.classList.add('is-invalid');
            const feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.textContent = 'メールアドレスを入力してください';
            emailField.appendChild(feedback);
            return false;
        }
        
        // メールアドレスの形式チェック
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            emailInput.classList.add('is-invalid');
            const feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.textContent = '有効なメールアドレスを入力してください';
            emailField.appendChild(feedback);
            return false;
        }
        
        emailInput.classList.add('is-valid');
        return true;
    }
});


