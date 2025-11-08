``` mermaid
flowchart TB
    subgraph MainWindow["リアルタイム画像解析アプリ"]
        subgraph Camera["カメラ映像"]
            Frame1["人物（緑枠）"]
            Frame2["犬（青枠）"]
        end
        subgraph ResultPanel["解析結果パネル"]
            Item1["人: 95%"]
            Item2["犬: 88%"]
            Item3["車: 76%"]
        end
    end
    Status["FPS: 28 | CPU: 42% | GPU: 12%"]

    Camera --> ResultPanel
    MainWindow --> Status
```