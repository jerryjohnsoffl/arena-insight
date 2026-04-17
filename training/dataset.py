import os
import tensorflow as tf
import numpy as np
from PIL import Image
import cv2
from scipy.ndimage import gaussian_filter
import scipy.io

class CrowdDataGenerator(tf.keras.utils.Sequence):
    def __init__(self, data_sources, batch_size=4, target_size=(1024, 1024), shuffle=True, augmentation=False):
        """
        data_sources: List of dicts, each with 'img_dir' and 'gt_dir'
        """
        self.samples = []
        for source in data_sources:
            img_dir = source['img_dir']
            gt_dir = source['gt_dir']
            if not os.path.exists(img_dir):
                print(f"Warning: {img_dir} does not exist. Skipping.")
                continue
            
            for f in os.listdir(img_dir):
                if f.lower().endswith(('.jpg', '.png', '.jpeg')):
                    self.samples.append({
                        'img_path': os.path.join(img_dir, f),
                        'gt_dir': gt_dir,
                        'name': f
                    })
        
        self.batch_size = batch_size
        self.target_size = target_size
        self.shuffle = shuffle
        self.augmentation = augmentation
        self.on_epoch_end()

    def __len__(self):
        return int(np.floor(len(self.samples) / self.batch_size))

    def on_epoch_end(self):
        self.indexes = np.arange(len(self.samples))
        if self.shuffle:
            np.random.shuffle(self.indexes)

    def load_gt_points(self, gt_dir, img_name):
        base_name = os.path.splitext(img_name)[0]
        
        # Try .npy
        npy_path = os.path.join(gt_dir, base_name + '.npy')
        if os.path.exists(npy_path):
            return np.load(npy_path)
        
        # Try ShanghaiTech .mat format (usually GT_IMG_X.mat)
        mat_name = f"GT_{base_name}.mat"
        mat_path = os.path.join(gt_dir, mat_name)
        if os.path.exists(mat_path):
            try:
                mat_data = scipy.io.loadmat(mat_path)
                # Standard ShanghaiTech structure: image_info[0,0][0,0][0]
                points = mat_data['image_info'][0,0][0,0][0]
                return points
            except Exception as e:
                print(f"Error loading mat file {mat_path}: {e}")
            
        return []

    def generate_density_map(self, shape, points, original_shape):
        h, w = shape[:2]
        orig_h, orig_w = original_shape[:2]
        density = np.zeros((h, w), dtype=np.float32)
        
        if len(points) == 0:
            return density
        
        # Scale points from original image size to target size
        scale_x = w / orig_w
        scale_y = h / orig_h
        
        for p in points:
            x, y = int(p[0] * scale_x), int(p[1] * scale_y)
            # Clip to boundaries
            x, y = min(w-1, max(0, x)), min(h-1, max(0, y))
            density[y, x] = 1
        
        # Blur points into a density map
        density = gaussian_filter(density, sigma=4)
        return density

    def __getitem__(self, index):
        indexes = self.indexes[index * self.batch_size:(index + 1) * self.batch_size]
        batch_samples = [self.samples[k] for k in indexes]

        X, y = [], []

        for sample in batch_samples:
            try:
                img = Image.open(sample['img_path']).convert('RGB')
                orig_size = img.size # (W, H)
                
                img_resized = img.resize(self.target_size)
                img_arr = np.array(img_resized, dtype=np.float32) / 255.0
                
                points = self.load_gt_points(sample['gt_dir'], sample['name'])
                
                # Generate density map at original resolution (to avoid scaling artifacts)
                # and then resize it to 1/4 matching model output.
                density = self.generate_density_map(
                    (self.target_size[1], self.target_size[0]), 
                    points, 
                    (orig_size[1], orig_size[0])
                )
                
                # Simple augmentation (Horizontal Flip)
                if self.augmentation and np.random.random() > 0.5:
                    img_arr = np.fliplr(img_arr)
                    density = np.fliplr(density)

                # Resize density map to 1/4 (256x256) to match regression head output
                density_resized = cv2.resize(density, (self.target_size[0] // 4, self.target_size[1] // 4))
                
                X.append(img_arr)
                y.append(np.expand_dims(density_resized, axis=-1))
            except Exception as e:
                print(f"Error processing sample {sample['name']}: {e}")

        return np.array(X, dtype=np.float32), np.array(y, dtype=np.float32)
