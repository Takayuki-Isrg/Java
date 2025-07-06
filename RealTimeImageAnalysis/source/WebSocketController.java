package jp.example;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/api/ws/image-analysis")
public class WebSocketController {

    /**
     * 接続中のセッションを保持するための Set。
     * ConcurrentHashMap の keySet() を利用しスレッドセーフな実装に。
     */
    private static final Set<Session> sessions = ConcurrentHashMap.newKeySet();

    /**
     * クライアント接続時に呼ばれる。
     * @param session 新規にオープンされた WebSocket セッション
     */
    @OnOpen
    public void onConnect(Session session) {
        // セッションを登録して管理対象に追加
        sessions.add(session);

        // 必要ならクライアントへ「接続成功」メッセージを返信
        try {
            session.getBasicRemote()
                   .sendText("{\"status\":\"connected\",\"sessionId\":\"" + session.getId() + "\"}");
        } catch (Exception e) {
            // ログ出力やエラーハンドリング
            System.out.println("クライアントへの接続が失敗しました：" + e.getMessage);
            e.printStackTrace();
        }
    }

    /**
     * クライアントからメッセージを受信したときのハンドラ。
     * ここでは省略します。
     */
    @OnMessage
    public void onMessage(Session session, String message) {
        // 省略
    }

    /**
     * クライアント切断時に呼ばれる。
     * @param session 切断された WebSocket セッション
     */
    @OnClose
    public void onClose(Session session) {
        // セッションを削除して管理対象から外す
        sessions.remove(session);

        // （任意）切断完了のログ出力など
        System.out.printf("Session %s closed, remaining sessions: %d%n",
        session.getId(), sessions.size());
    }

    // （任意）全セッションへプッシュ送信したいときのユーティリティ
    private void broadcast(String json) {
        sessions.forEach(s -> {
            try {
                s.getBasicRemote().sendText(json);
            } catch (Exception e) {
                System.out.println("全セッションへのプッシュ送信が失敗しました：" + e.getMessage);
                e.printStackTrace();
            }
        });
    }
}
