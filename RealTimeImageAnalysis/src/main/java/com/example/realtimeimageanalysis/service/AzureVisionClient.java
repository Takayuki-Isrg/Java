package com.example.realtimeimageanalysis.service;

import com.example.realtimeimageanalysis.model.DetectedObject;
import java.net.URL;
import java.util.List;

public interface AzureVisionClient {
  List<String> analyzeTags(URL blobUrl);

  String analyzeOcr(URL blobUrl);

  List<DetectedObject> detectObjects(URL blobUrl);
}
