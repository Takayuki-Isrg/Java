package com.example.realtimeimageanalysis.websocket;

import com.example.realtimeimageanalysis.model.AnalysisRecord;
import com.example.realtimeimageanalysis.model.AnalysisResult;
import com.example.realtimeimageanalysis.service.ImageProcessorService;
import com.example.realtimeimageanalysis.service.ResultRepository;
import com.example.realtimeimageanalysis.service.VirtualThreadExecutor;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.Instant;

public class WebSocketController {
  private final VirtualThreadExecutor executor;
  private final ImageProcessorService imageProcessorService;
  private final ResultRepository resultRepository;

  public WebSocketController(
      VirtualThreadExecutor executor,
      ImageProcessorService imageProcessorService,
      ResultRepository resultRepository) {
    this.executor = executor;
    this.imageProcessorService = imageProcessorService;
    this.resultRepository = resultRepository;
  }

  public void onConnect(String sessionId) {
    // TODO: track session and handshake for the client.
  }

  public void onMessage(String imageId, String blobUrl) {
    executor.execute(() -> {
      AnalysisResult result = imageProcessorService.processImage(imageId, toUrl(blobUrl));
      resultRepository.save(new AnalysisRecord(imageId, result, Instant.now()));
      // TODO: send result back to the session over WebSocket.
    });
  }

  public void onClose(String sessionId) {
    // TODO: cleanup resources for session.
  }

  private URL toUrl(String blobUrl) {
    try {
      return new URL(blobUrl);
    } catch (MalformedURLException e) {
      throw new IllegalArgumentException("Invalid blob URL: " + blobUrl, e);
    }
  }
}
