import { useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';

export function useCrowdModel() {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initModel() {
      try {
        const loadedModel = await tf.loadLayersModel('/model/model.json');
        setModel(loadedModel);
      } catch (err) {
        console.error('Failed to load crowd model:', err);
        setError('Crowd analysis engine offline. Refresh page or check connection.');
      } finally {
        setIsInitializing(false);
      }
    }
    initModel();
  }, []);

  const estimateCrowd = useCallback(async (imageElement: HTMLImageElement | HTMLVideoElement, isActiveMatch: boolean = false): Promise<number> => {
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
      const countArray = prediction.dataSync();
      
      // Sum the density map
      let total = 0;
      for (let i = 0; i < countArray.length; i++) {
        total += countArray[i];
      }
      
      return isActiveMatch ? Math.round(total * 1.2) : Math.round(total);
    });
  }, [model]);

  return { model, isInitializing, error, estimateCrowd };
}

