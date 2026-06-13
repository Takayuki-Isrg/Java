package com.example.realtimeimageanalysis.model;

public record DetectedObject(int x, int y, int width, int height, String label) {}
