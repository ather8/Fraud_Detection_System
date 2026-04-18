import onnxruntime as ort
import numpy as np
import joblib
import os

class ModelLoader:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
            # Define paths relative to this file
            base_path = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            model_path = os.path.join(base_path, "ml_models", "iso_forest.onnx")
            scaler_path = os.path.join(base_path, "ml_models", "iso_scaler.pkl")

            try:
                # Load the ONNX inference session
                cls._instance.session = ort.InferenceSession(model_path)
                cls._instance.input_name = cls._instance.session.get_inputs()[0].name
                
                # Load the StandardScaler
                cls._instance.scaler = joblib.load(scaler_path)
                print("✅ Model and Scaler loaded successfully.")
            except Exception as e:
                print(f"❌ Error loading model/scaler: {e}")
                raise e
        
        return cls._instance

    def predict(self, raw_features: list):
        """
        Preprocesses raw input and runs ONNX inference.
        """
        # 1. Convert to numpy and reshape for a single sample
        input_array = np.array(raw_features).reshape(1, -1).astype(np.float32)
        
        # 2. Scale the data using the loaded Scaler
        scaled_data = self.scaler.transform(input_array)
        
        # 3. Run Inference
        # For Autoencoders, this returns the reconstructed output
        outputs = self.session.run(None, {self.input_name: scaled_data})
        reconstructed_data = outputs[0]
        
        return scaled_data, reconstructed_data

# Create a single global instance to be used across the app
model_service = ModelLoader()
