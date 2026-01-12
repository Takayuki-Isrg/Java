/**
 * ログインフォームのJavaScript制御
 * 非同期送信、バリデーション、エラーハンドリングを提供
*/

'use strict';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form[action="/login"]');
    if (!form) {
        console.warn('ログインフォームが見つかりません');
        return;
    }
    
    const submitButton = form.querySelector('button[type="submit"]');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberMeInput = document.getElementById('rememberMe');
    
    if (!submitButton || !usernameInput || !passwordInput) {
        console.warn('必要なフォーム要素が見つかりません');
        return;
    }
    
    // セッション期限切れのチェック
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('expired') === 'true') {
        // showErrorMessage は api-utils.js で定義されているため、事前に読み込まれている必要がある
        if (typeof showErrorMessage === 'function') {
            showErrorMessage('セッションが期限切れです。再度ログインしてください。');
        } else {
            // フォールバック: アラートで表示
            alert('セッションが期限切れです。再度ログインしてください。');
        }
    }
    
    // フォーム送信の非同期処理（オプション：通常のフォーム送信も有効）
    // 注意：Spring Securityのフォームログインは通常のPOST送信が必要な場合があります
    
    // リアルタイムバリデーション
    if (usernameInput) {
        usernameInput.addEventListener('blur', function() {
            validateUsername();
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            validatePassword();
        });
    }
    
    // Enterキーでフォーム送信
    form.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            form.requestSubmit();
        }
    });
    
    /**
     * ユーザー名のバリデーション
     */
    function validateUsername() {
        const username = usernameInput.value.trim();
        const usernameField = usernameInput.parentElement;
        
        // 既存のエラーメッセージを削除
        const existingError = usernameField.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
        usernameInput.classList.remove('is-invalid', 'is-valid');
        
        if (!username) {
            usernameInput.classList.add('is-invalid');
            const feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.textContent = 'ユーザー名を入力してください';
            usernameField.appendChild(feedback);
            return false;
        }
        
        if (username.length < 3) {
            usernameInput.classList.add('is-invalid');
            const feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.textContent = 'ユーザー名は3文字以上である必要があります';
            usernameField.appendChild(feedback);
            return false;
        }
        
        usernameInput.classList.add('is-valid');
        return true;
    }
    
    /**
     * パスワードのバリデーション
     */
    function validatePassword() {
        const password = passwordInput.value;
        const passwordField = passwordInput.parentElement;
        
        // 既存のエラーメッセージを削除
        const existingError = passwordField.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
        passwordInput.classList.remove('is-invalid', 'is-valid');
        
        if (!password) {
            passwordInput.classList.add('is-invalid');
            const feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.textContent = 'パスワードを入力してください';
            passwordField.appendChild(feedback);
            return false;
        }
        
        if (password.length < 6) {
            passwordInput.classList.add('is-invalid');
            const feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.textContent = 'パスワードは6文字以上である必要があります';
            passwordField.appendChild(feedback);
            return false;
        }
        
        passwordInput.classList.add('is-valid');
        return true;
    }
    
    /**
     * フォーム全体のバリデーション
     */
    function validateForm() {
        const usernameValid = validateUsername();
        const passwordValid = validatePassword();
        return usernameValid && passwordValid;
    }
    
    // フォーム送信前のバリデーション（通常のフォーム送信を維持）
    form.addEventListener('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
            return false;
        }
        
        // 送信ボタンを無効化（二重送信防止）
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ログイン中...';
        
        // フォーム送信を許可（通常のPOST送信）
        // 非同期送信が必要な場合は、以下のコメントを解除して通常の送信を無効化
        /*
        e.preventDefault();
        
        // showErrorMessage は api-utils.js で定義されているため、事前に読み込まれている必要がある
        if (typeof submitFormAsync === 'function' && typeof showErrorMessage === 'function') {
            submitFormAsync(
                form,
                '/login',
                'POST',
                function(response) {
                    // 成功時の処理
                    if (response.status === 200) {
                        window.location.href = '/dashboard';
                    }
                },
                function(error) {
                    // エラー時の処理
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'ログイン';
                    
                    if (error.status === 401) {
                        showErrorMessage('ユーザー名またはパスワードが正しくありません');
                    } else {
                        showErrorMessage(error.message || 'ログインに失敗しました');
                    }
                }
            );
        } else {
            console.error('submitFormAsync または showErrorMessage が定義されていません');
            submitButton.disabled = false;
            submitButton.innerHTML = 'ログイン';
        }
        */
    });
});


