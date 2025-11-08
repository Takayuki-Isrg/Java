package com.example.realtimeimageanalysis;

public class ImageProcessorService {
	
	
	public void processImage(String blobUrl) {
        // 1. ログ出力: 開始時刻と blobUrl を記録
        long startTime = System.currentTimeMillis();
        System.out.println("processImage 開始: " + startTime + " ms, blobUrl=" + blobUrl);
        // 2. 入力検証: blobUrl の null/空チェックおよび形式確認
		BlobUrlValidator.validate(blobUrl);
		
		// 3. 並列実行: AzureVisionClient を使いタグ解析・OCR解析・物体検出を同時実行
        AzureVisionClient.analyzeImage(blobUrl);
		
		// 4. 結果集約: AnalysisResult オブジェクトにタグ・テキスト・物体結果をまとめる
        AnalysisResult.merge(tagResult, ocrResult, objectDetectionResult);
		
		// 5. 永続化: ResultRepository.save(new AnalysisRecord(...))
        ResultRepository.save(new AnalysisRecord(...));
		
		// 6. 呼び出し元へ AnalysisResult を返却
        return analysisResult;
	
	}
	
}
