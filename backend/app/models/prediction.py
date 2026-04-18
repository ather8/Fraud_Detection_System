from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import json

class PredictionLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    reconstruction_error: float
    is_fraud: bool
    # We store the importance list as a JSON string
    importance_json: str 

    def set_importance(self, importance_list: list):
        self.importance_json = json.dumps(importance_list)

    def get_importance(self):
        return json.loads(self.importance_json)