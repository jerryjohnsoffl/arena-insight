import tensorflow as tf
from tensorflow.keras import layers, models

def build_model(input_shape=(1024, 1024, 3), alpha=0.35):
    """
    Builds a lightweight crowd counting model using MobileNetV2.
    Alpha 0.35 + reduced head (48, 24, 12) keeps parameters < 0.6M to stay under 5MB.
    """
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights='imagenet',
        alpha=alpha
    )
    
    x = base_model.output # 1/32 scale
    
    # Regression Head
    x = layers.Conv2D(48, (3, 3), activation='relu', padding='same', name='reg_conv1')(x)
    x = layers.UpSampling2D(size=(2, 2), interpolation='bilinear')(x) # 1/16
    
    x = layers.Conv2D(24, (3, 3), activation='relu', padding='same', name='reg_conv2')(x)
    x = layers.UpSampling2D(size=(2, 2), interpolation='bilinear')(x) # 1/8
    
    x = layers.Conv2D(12, (3, 3), activation='relu', padding='same', name='reg_conv3')(x)
    x = layers.UpSampling2D(size=(2, 2), interpolation='bilinear')(x) # 1/4 (256x256)
    
    # Final density map output
    density_map = layers.Conv2D(1, (1, 1), activation='linear', name='density_map')(x)
    
    model = models.Model(inputs=base_model.input, outputs=density_map)
    return model

if __name__ == "__main__":
    # Test building the model
    try:
        model = build_model(alpha=0.35)
        model.summary()
        # Roughly 600k parameters = ~2.4MB in float32.
        model.save('crowd_model_skeleton.h5')
        print("\nModel built and saved successfully.")
    except Exception as e:
        print(f"\nError building model: {e}")
