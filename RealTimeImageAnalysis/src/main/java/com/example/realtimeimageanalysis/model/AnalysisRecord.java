package com.example.realtimeimageanalysis.model;

import java.time.Instant;

public record AnalysisRecord(String imageId, AnalysisResult result, Instant analyzedAt) {}
