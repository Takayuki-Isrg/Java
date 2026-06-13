package com.example.realtimeimageanalysis.service;

import com.example.realtimeimageanalysis.model.AnalysisRecord;

public interface ResultRepository {
  void save(AnalysisRecord record);
}
