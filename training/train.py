import os
import tensorflow as tf
from model import build_model
from dataset import CrowdDataGenerator

def train():
    # Detect GPU and configure memory growth for TF 2.10
    gpus = tf.config.list_physical_devices('GPU')
    if gpus:
        print(f"GPUs detected: {len(gpus)}")
        try:
            for gpu in gpus:
                tf.config.experimental.set_memory_growth(gpu, True)
        except RuntimeError as e:
            print(f"Memory growth config error: {e}")
    else:
        print("Running on CPU")

    # Hyperparameters
    LR = 1e-4
    BATCH_SIZE = 8
    EPOCHS = 100
    IMG_SIZE = (1024, 1024, 3)

    # Data Sources
    # 1. ShanghaiTech Part B
    train_sources = [
        {
            'img_dir': '../ShanghaiTech/part_B/train_data/images',
            'gt_dir': '../ShanghaiTech/part_B/train_data/ground-truth'
        }
        # Add other sources here if needed
    ]

    val_sources = [
        {
            'img_dir': '../ShanghaiTech/part_B/test_data/images',
            'gt_dir': '../ShanghaiTech/part_B/test_data/ground-truth'
        }
    ]

    # Generators
    print("Initializing Data Generators...")
    train_gen = CrowdDataGenerator(
        data_sources=train_sources,
        batch_size=BATCH_SIZE,
        target_size=(1024, 1024),
        shuffle=True,
        augmentation=True
    )

    val_gen = CrowdDataGenerator(
        data_sources=val_sources,
        batch_size=BATCH_SIZE,
        target_size=(1024, 1024),
        shuffle=False,
        augmentation=False
    )

    print(f"Total training samples: {len(train_gen.samples)}")
    print(f"Total validation samples: {len(val_gen.samples)}")

    if len(train_gen.samples) == 0:
        print("Error: No training data found. Please check dataset paths.")
        return

    # Build and compile model
    model = build_model(input_shape=IMG_SIZE, alpha=0.35)
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=LR),
        loss='mse',
        metrics=['mae']
    )

    # Callbacks
    callbacks = [
        tf.keras.callbacks.ModelCheckpoint('best_crowd_model.h5', save_best_only=True, monitor='val_loss'),
        tf.keras.callbacks.EarlyStopping(patience=15, restore_best_weights=True, monitor='val_loss'),
        tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=5)
    ]

    print("\nTraining configuration ready.")
    print("To start training, uncomment the model.fit() block in this file.")
    
    # model.fit(
    #     train_gen,
    #     validation_data=val_gen,
    #     epochs=EPOCHS,
    #     callbacks=callbacks
    # )

    model.save('crowd_model_skeleton.h5')
    print("Model skeleton saved as crowd_model_skeleton.h5")

if __name__ == "__main__":
    train()
