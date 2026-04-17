import { useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';

export function useCrowdModel() {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function initModel() {
      try {
        const loadedModel = await tf.loadLayersModel('/model/model.json');
        setModel(loadedModel);
      } catch (error) {
        console.error('Failed to load crowd model:', error);
      } finally {
        setIsInitializing(false);
      }
    }
    initModel();
  }, []);

  const estimateCrowd = useCallback(async (imageElement: HTMLImageElement | HTMLVideoElement): Promise<number> => {
    if (!model) return 0;
    
    return tf.tidy(() => {
      // Create tensor from image/video frame
      const tensor = tf.browser
        .fromPixels(imageElement)
        .resizeBilinear([1024, 1024])
        .expandDims(0)
        .toFloat()
        .div(tf.scalar(255));

      // Run inference
      const prediction = model.predict(tensor) as tf.Tensor;
      // Get data synchronously to avoid await in tidy, or we can use async out of tidy
      // Actually dataSync is better inside tidy
      const countArray = prediction.dataSync();
      
      // Sum the density map
      let total = 0;
      for (let i = 0; i < countArray.length; i++) {
        total += countArray[i];
      }
      return Math.round(total);
    });
  }, [model]);

  return { model, isInitializing, estimateCrowd };
}
