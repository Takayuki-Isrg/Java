package com.example.realtimeimageanalysis.service;

import com.example.realtimeimageanalysis.model.AnalysisResult;
import com.example.realtimeimageanalysis.model.DetectedObject;
import java.net.URL;
import java.util.List;
import java.util.concurrent.StructuredTaskScope;

public class ImageProcessorService {
  private final AzureVisionClient visionClient;

  public ImageProcessorService(AzureVisionClient visionClient) {
    this.visionClient = visionClient;
  }

  public AnalysisResult processImage(String imageId, URL blobUrl) {
    try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
      var tagsTask = scope.fork(() -> visionClient.analyzeTags(blobUrl));
      var ocrTask = scope.fork(() -> visionClient.analyzeOcr(blobUrl));
      var objectsTask = scope.fork(() -> visionClient.detectObjects(blobUrl));

      scope.join().throwIfFailed();

      List<String> tags = tagsTask.get();
      String ocrText = ocrTask.get();
      List<DetectedObject> objects = objectsTask.get();

      return new AnalysisResult(imageId, tags, ocrText, objects);
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new IllegalStateException("Image analysis interrupted", e);
    }
  }
}
