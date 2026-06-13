package com.example.realtimeimageanalysis.model;

import java.util.List;

public record AnalysisResult(String imageId, List<String> tags, String ocrText, List<DetectedObject> objects) {}
