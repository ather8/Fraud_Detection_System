import onnxruntime as ort
import numpy as np
import joblib
import os

class MLService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MLService, cls).__new__(cls)
            base_path = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            
            # Paths to your exported files
            model_path = os.path.join(base_path, "ml_models", "iso_forest.onnx")
            scaler_path = os.path.join(base_path, "ml_models", "iso_scaler.pkl")

            try:
                cls._instance.session = ort.InferenceSession(model_path)
                cls._instance.input_name = cls._instance.session.get_inputs()[0].name
                cls._instance.scaler = joblib.load(scaler_path)
                print("✅ Isolation Forest Engine Ready.")
            except Exception as e:
                print(f"❌ ML Init Failed: {e}")
                raise e
        return cls._instance

    def run_inference(self, raw_features: list):
        # Must be exactly 11 features: [V2, V4, V7, V11, V12, V14, V16, V17, V18, V19, Hour]
        input_data = np.array(raw_features).reshape(1, -1).astype(np.float32)
        scaled_data = self.scaler.transform(input_data)
        
        # Isolation Forest ONNX returns [label, scores]
        outputs = self.session.run(None, {self.input_name: scaled_data})
        return scaled_data, outputs

ml_engine = MLService()
