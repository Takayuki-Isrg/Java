/**
 * API通信ユーティリティ
 * axiosを使用したHTTP通信とステータスチェック機能を提供
 */

// axiosのCDN読み込み確認（未読み込みの場合はエラーを表示）
if (typeof axios === 'undefined') {
    console.error('axiosが読み込まれていません。HTMLにaxiosのCDNを追加してください。');
}

/**
 * CSRFトークンを取得
 * @returns {string} CSRFトークン
 */
function getCsrfToken() {
    const token = document.querySelector('meta[name="_csrf"]');
    if (token) {
        return token.getAttribute('content');
    }
    // フォームから取得を試みる
    const formToken = document.querySelector('input[name*="_csrf"]');
    if (formToken) {
        return formToken.value;
    }
    return '';
}

/**
 * CSRFトークンをmetaタグに設定
 * @param {string} token CSRFトークン
 */
function setCsrfToken(token) {
    let meta = document.querySelector('meta[name="_csrf"]');
    if (!meta) {
        meta = document.createElement('meta');
        meta.name = '_csrf';
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', token);
}

/**
 * axiosインスタンスの作成（CSRFトークンとエラーハンドリングを含む）
 */
const apiClient = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

// リクエストインターセプター：CSRFトークンを自動追加
apiClient.interceptors.request.use(
    function(config) {
        const token = getCsrfToken();
        if (token) {
            config.headers['X-CSRF-TOKEN'] = token;
        }
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

// レスポンスインターセプター：HTTPステータスチェックとエラーハンドリング
apiClient.interceptors.response.use(
    function(response) {
        // 2xx系のステータスコードは成功として処理
        const status = response.status;
        console.log(`[API成功] ステータス: ${status}, URL: ${response.config.url}`);
        
        // レスポンスからCSRFトークンを更新（サーバーが返す場合）
        if (response.headers['x-csrf-token']) {
            setCsrfToken(response.headers['x-csrf-token']);
        }
        
        return response;
    },
    function(error) {
        // エラーレスポンスの処理
        if (error.response) {
            // サーバーからレスポンスが返ってきた場合
            const status = error.response.status;
            const statusText = error.response.statusText;
            const url = error.config ? error.config.url : '不明';
            
            console.error(`[APIエラー] ステータス: ${status} ${statusText}, URL: ${url}`);
            
            // ステータスコードに応じた処理
            switch (status) {
                case 400:
                    console.error('バリデーションエラーまたは不正なリクエスト');
                    break;
                case 401:
                    console.error('認証が必要です。ログインしてください。');
                    // ログインページにリダイレクト
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login?expired=true';
                    }
                    break;
                case 403:
                    console.error('アクセス権限がありません');
                    showErrorMessage('この操作を実行する権限がありません。');
                    break;
                case 404:
                    console.error('リソースが見つかりません');
                    showErrorMessage('リソースが見つかりませんでした。');
                    break;
                case 422:
                    console.error('バリデーションエラー');
                    break;
                case 500:
                    console.error('サーバー内部エラー');
                    showErrorMessage('サーバーでエラーが発生しました。しばらくしてから再度お試しください。');
                    break;
                default:
                    console.error(`予期しないエラー: ${status} ${statusText}`);
                    showErrorMessage(`エラーが発生しました (${status})`);
            }
            
            // エラーレスポンスの詳細を返す
            return Promise.reject({
                status: status,
                statusText: statusText,
                data: error.response.data,
                message: getErrorMessage(error.response)
            });
        } else if (error.request) {
            // リクエストは送信されたが、レスポンスが受信できなかった場合
            console.error('[APIエラー] ネットワークエラー: サーバーに接続できませんでした');
            showErrorMessage('サーバーに接続できませんでした。ネットワーク接続を確認してください。');
            return Promise.reject({
                status: 0,
                statusText: 'Network Error',
                message: 'ネットワークエラーが発生しました'
            });
        } else {
            // リクエストの設定中にエラーが発生した場合
            console.error('[APIエラー] リクエスト設定エラー:', error.message);
            showErrorMessage('リクエストの送信に失敗しました。');
            return Promise.reject({
                status: 0,
                statusText: 'Request Error',
                message: error.message
            });
        }
    }
);

/**
 * エラーレスポンスからエラーメッセージを取得
 * @param {Object} response エラーレスポンス
 * @returns {string} エラーメッセージ
 */
function getErrorMessage(response) {
    if (response.data) {
        if (typeof response.data === 'string') {
            return response.data;
        }
        if (response.data.message) {
            return response.data.message;
        }
        if (response.data.error) {
            return response.data.error;
        }
        // バリデーションエラーの場合
        if (response.data.errors && Array.isArray(response.data.errors)) {
            return response.data.errors.map(e => e.defaultMessage || e.message).join('\n');
        }
    }
    return response.statusText || 'エラーが発生しました';
}

/**
 * 成功メッセージを表示
 * @param {string} message メッセージ
 * @param {string} type メッセージタイプ（success, info, warning）
 */
function showSuccessMessage(message, type = 'success') {
    const alertClass = type === 'success' ? 'alert-success' : 
                      type === 'info' ? 'alert-info' : 
                      type === 'warning' ? 'alert-warning' : 'alert-success';
    
    const alertHtml = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle-fill"></i>
            <strong>${message}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // ページの上部にメッセージを表示
    const container = document.querySelector('.container, .container-fluid');
    if (container) {
        const alertDiv = document.createElement('div');
        alertDiv.innerHTML = alertHtml;
        container.insertBefore(alertDiv.firstElementChild, container.firstChild);
        
        // 5秒後に自動的に非表示
        setTimeout(() => {
            const alert = container.querySelector('.alert');
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    }
}

/**
 * エラーメッセージを表示
 * @param {string} message エラーメッセージ
 */
function showErrorMessage(message) {
    showSuccessMessage(message, 'danger');
}

/**
 * フォームデータをJSONに変換
 * @param {HTMLFormElement} form フォーム要素
 * @returns {Object} JSONオブジェクト
 */
function formToJson(form) {
    const formData = new FormData(form);
    const json = {};
    for (const [key, value] of formData.entries()) {
        // CSRFトークンは除外
        if (key.includes('_csrf')) {
            continue;
        }
        json[key] = value;
    }
    return json;
}

/**
 * フォーム送信を非同期で処理
 * @param {HTMLFormElement} form フォーム要素
 * @param {string} url 送信先URL
 * @param {string} method HTTPメソッド（GET, POST, PUT, DELETE）
 * @param {Function} onSuccess 成功時のコールバック
 * @param {Function} onError エラー時のコールバック
 * @returns {Promise} Promiseオブジェクト
 */
async function submitFormAsync(form, url, method = 'POST', onSuccess = null, onError = null) {
    try {
        const formData = formToJson(form);
        const config = {
            method: method,
            url: url,
            data: formData
        };
        
        const response = await apiClient(config);
        
        if (onSuccess) {
            onSuccess(response);
        } else {
            // デフォルトの成功処理：リダイレクトまたはメッセージ表示
            if (response.data && response.data.redirect) {
                window.location.href = response.data.redirect;
            } else {
                showSuccessMessage('処理が完了しました');
            }
        }
        
        return response;
    } catch (error) {
        if (onError) {
            onError(error);
        } else {
            // デフォルトのエラー処理
            const errorMessage = error.message || getErrorMessage(error.response || {});
            showErrorMessage(errorMessage);
        }
        throw error;
    }
}

// グローバルにエクスポート
window.apiClient = apiClient;
window.getCsrfToken = getCsrfToken;
window.setCsrfToken = setCsrfToken;
window.showSuccessMessage = showSuccessMessage;
window.showErrorMessage = showErrorMessage;
window.formToJson = formToJson;
window.submitFormAsync = submitFormAsync;

