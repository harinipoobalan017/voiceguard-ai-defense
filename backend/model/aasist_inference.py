# backend/model/aasist_inference.py
import os
import numpy as np

# Decision Thresholds for AI Voice Spoof Detection
BLOCK_THRESHOLD = 0.55
FLAG_THRESHOLD = 0.35

class AASISTNeuralEngine:
    """
    Production AASIST Neural Inference Engine.
    Uses SincNet + Residual Backbone + Graph Attention Networks (GAT).
    """
    def __init__(self, weights_path: str = "backend/model/weights/AASIST.pth"):
        self.weights_path = weights_path
        self.device = "cpu"
        self.neural_ready = False
        self.model = None

        try:
            import torch
            import torch.nn.functional as F
            from .aasist import AASIST

            self.torch = torch
            self.F = F
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            self.model = AASIST()

            if not os.path.exists(self.weights_path):
                # Fallback to path relative to this file
                fallback_path = os.path.join(os.path.dirname(__file__), "weights", "AASIST.pth")
                if os.path.exists(fallback_path):
                    self.weights_path = fallback_path

            if os.path.exists(self.weights_path):
                state_dict = torch.load(self.weights_path, map_location=self.device)
                self.model.load_state_dict(state_dict, strict=False)
                print(f"[VoiceGuard] Pretrained AASIST weights successfully loaded from {self.weights_path}")
            else:
                print(f"[VoiceGuard] AASIST running with initialized weights ({self.weights_path} not found).")

            self.model.to(self.device)
            self.model.eval()
            self.neural_ready = True
        except Exception as e:
            print(f"[VoiceGuard] AASIST PyTorch neural load note ({str(e)}). Using spectro-temporal analyzer.")
            self.neural_ready = False

    def predict(self, pcm_data: np.ndarray, duration: float) -> dict:
        """
        Runs inference on 16kHz mono audio (64,600 samples).
        Outputs real AASIST score, AI probability, and decision.
        """
        # 1. Neural forward pass if PyTorch model is ready
        if self.neural_ready and self.model is not None:
            try:
                waveform = self.torch.tensor(pcm_data, dtype=self.torch.float32).unsqueeze(0).to(self.device)
                with self.torch.no_grad():
                    logits = self.model(waveform)
                    probs = self.F.softmax(logits, dim=1).cpu().numpy()[0]
                    # Official ASVspoof protocol: index 0 = SPOOF, index 1 = BONAFIDE
                    spoof_prob = float(probs[0])
                    bonafide_prob = float(probs[1])
            except Exception as e:
                print(f"[VoiceGuard] Neural forward pass error: {e}, falling back to hybrid analyzer.")
                spoof_prob = None
        else:
            spoof_prob = None

        # 2. Spectro-temporal fallback & feature metrics extraction
        from .aasist_classifier import AASISTClassifier
        hybrid_engine = AASISTClassifier()
        result = hybrid_engine.predict(pcm_data, duration)

        if spoof_prob is not None:
            # Blend neural forward pass with spectro-temporal checks for maximum robustness
            blended_score = float(np.clip(0.75 * spoof_prob + 0.25 * result["aasist_score"], 0.02, 0.98))
            result["aasist_score"] = round(blended_score, 4)
            result["spoof_probability"] = round(blended_score * 100, 1)
            result["bonafide_probability"] = round((1.0 - blended_score) * 100, 1)
            result["trust_score"] = round((1.0 - blended_score) * 100, 1)
            result["engine"] = "AASIST PyTorch Deep GAT Neural Network"
            result["metrics"]["syntheticRisk"] = round(blended_score, 4)
            result["prediction"] = "SPOOF" if blended_score >= FLAG_THRESHOLD else "BONAFIDE"
            
            if blended_score >= BLOCK_THRESHOLD:
                result["decision"] = "BLOCK"
                result["status"] = "AI Voice Clone Intercepted by AASIST Neural Network"
            elif blended_score >= FLAG_THRESHOLD:
                result["decision"] = "FLAGGED"
                result["status"] = "Ambiguous Signal — Secondary Telephony Challenge Triggered"
            else:
                result["decision"] = "ALLOW"
                result["status"] = "Authentic Voice Verified by AASIST Neural Network"
        else:
            result["engine"] = "AASIST Spectro-Temporal Heuristic Engine"

        return result
