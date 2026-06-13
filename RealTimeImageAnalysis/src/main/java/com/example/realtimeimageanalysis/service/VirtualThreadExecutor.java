package com.example.realtimeimageanalysis.service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class VirtualThreadExecutor implements AutoCloseable {
  private final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();

  public void execute(Runnable task) {
    executor.execute(task);
  }

  @Override
  public void close() {
    executor.close();
  }
}
