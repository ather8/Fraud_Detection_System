import onnxruntime as ort
import numpy as np
import joblib
import os

class ModelLoader:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
            base_path = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            model_path = os.path.join(base_path, "ml_models", "iso_forest.onnx") # Updated filename
            scaler_path = os.path.join(base_path, "ml_models", "iso_scaler.pkl")

            try:
                cls._instance.session = ort.InferenceSession(model_path)
                cls._instance.input_name = cls._instance.session.get_inputs()[0].name
                cls._instance.scaler = joblib.load(scaler_path)
                print("✅ Isolation Forest and Scaler loaded.")
            except Exception as e:
                print(f"❌ Error: {e}")
                raise e
        return cls._instance

    def predict(self, raw_features: list):  # Rename this to 'predict'
        input_data = np.array(raw_features).reshape(1, -1).astype(np.float32)
        scaled_data = self.scaler.transform(input_data)
        outputs = self.session.run(None, {self.input_name: scaled_data})
        return scaled_data, outputs

model_service = ModelLoader()
