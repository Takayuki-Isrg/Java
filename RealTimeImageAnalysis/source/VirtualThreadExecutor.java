package com.example.realtimeimageanalysis;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

public class VirtualThreadExecutor {
    private final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
    private final Semaphore throttle;

    public VirtualThreadExecutor(int maxConcurrency) {
        this.throttle = new Semaphore(maxConcurrency);
    }

    /**
     * 外部から呼ばれる submit メソッド。
     * 与えられた task をラップして、同時実行数を制御する Runnable を executor に投げる。
     */
    public void submit(Runnable task) {
        executor.submit(wrap(task));
    }

    /** wrapper Runnable を返すユーティリティメソッド */
    private Runnable wrap(Runnable task) {
        return () -> {
            try {
                // 同時実行数を制御
                throttle.acquire();
                // 本来の処理を実行
                task.run();
            } catch (InterruptedException e) {
                // 割り込みフラグを復元しておく
                Thread.currentThread().interrupt();
            } finally {
                // 後続タスクへスロットを返却
                throttle.release();
            }
        };
    }

    public void shutdown() throws InterruptedException {
        executor.shutdown();
        executor.awaitTermination(30, TimeUnit.SECONDS);
    }
}
