import os
import tensorflow as tf

def convert_to_tfjs(model_path='best_crowd_model.h5', target_dir='../public/model'):
    """
    Converts a saved Keras model to TensorFlow.js format with quantization.
    Quantization is key to keeping the model size small (under 5MB).
    """
    try:
        import tensorflowjs as tfjs
    except ImportError:
        print("\n[!] Error: tensorflowjs or its dependencies (jax) are not fully installed.")
        print("    If you see 'No module named jax', it's a known environment conflict.")
        print("    You can still train with train.py, but conversion requires a clean environment.")
        return

    if not os.path.exists(model_path):
        # Try fallbacks
        fallbacks = ['crowd_model_final.h5', 'crowd_model_skeleton.h5']
        for fb in fallbacks:
            if os.path.exists(fb):
                model_path = fb
                break
        else:
            print(f"Error: {model_path} not found. Please train/save the model first.")
            return

    print(f"Loading {model_path}...")
    model = tf.keras.models.load_model(model_path)
    
    print(f"Converting to TFJS in {target_dir}...")
    
    # Using 8-bit quantization to significantly reduce model size (~1.2MB total)
    try:
        tfjs.converters.save_keras_model(
            model, 
            target_dir,
            quantization_dtype_map={'uint8': '*'}
        )
        print(f"Success! Model files are in {target_dir}/")
    except Exception as e:
        print(f"Conversion failed: {e}")

if __name__ == "__main__":
    convert_to_tfjs()
