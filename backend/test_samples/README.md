# VoiceGuard Calibration Test Samples

This directory holds audio samples used to calibrate and verify VoiceGuard's AASIST AI voice clone detection engine and tune decision thresholds.

## How to Use

1. **Add Human Voice Samples**:
   Drop 3+ real, uncompressed or standard voice audio clips (`.wav`, `.mp3`, `.ogg`, `.flac`, `.m4a`) into the `human/` folder.

2. **Add AI Voice Samples**:
   Drop 3+ AI-generated voice clips (e.g., ElevenLabs, Play.ht, OpenAI TTS, Voice-Craft, etc.) into the `ai/` folder.

3. **Run Calibration Script**:
   From the project root, execute:
   ```bash
   python backend/calibrate.py
   ```
   Or from within the `backend` folder:
   ```bash
   cd backend
   python calibrate.py
   ```

4. **Review Results & Tune Thresholds**:
   The script outputs the score, decision (`ALLOW`, `FLAGGED`, `BLOCK`), and correctness for each sample, along with group averages and separation gap.
   You can adjust `BLOCK_THRESHOLD` and `FLAG_THRESHOLD` at the top of `backend/model/aasist_inference.py` based on the separation gap.
