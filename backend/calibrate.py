#!/usr/bin/env python3
"""
VoiceGuard AASIST Engine Calibration & Threshold Tuning Tool
Evaluates real human voice samples vs synthetic AI voice clones to measure separation
gap and optimize decision thresholds (BLOCK_THRESHOLD, FLAG_THRESHOLD).
"""

import os
import sys
import argparse
from pathlib import Path

# Add backend directory to sys.path so utils and model can be imported directly
CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

# Also add project root if applicable
PROJECT_ROOT = CURRENT_DIR.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

from utils import preprocess_audio
from model.aasist_inference import AASISTNeuralEngine, BLOCK_THRESHOLD, FLAG_THRESHOLD

SUPPORTED_EXTENSIONS = {".wav", ".mp3", ".ogg", ".flac", ".m4a", ".webm", ".aac", ".wma"}


def resolve_folder(path_str: str, default_rel: str) -> Path:
    """Resolves folder path relative to current working dir or backend root."""
    p = Path(path_str) if path_str else CURRENT_DIR / default_rel
    if not p.exists():
        # Check relative to CURRENT_DIR if not found in cwd
        alt = CURRENT_DIR / path_str
        if alt.exists():
            return alt
        # Check relative to PROJECT_ROOT
        alt2 = PROJECT_ROOT / path_str
        if alt2.exists():
            return alt2
    return p


def process_audio_file(engine: AASISTNeuralEngine, file_path: Path, expected_label: str):
    """
    Runs audio file through preprocess_audio() + AASISTNeuralEngine.predict().
    Returns dict with result row or None if processing failed.
    """
    try:
        with open(file_path, "rb") as f:
            content = f.read()

        if len(content) == 0:
            print(f"[WARNING] Skipping empty file: {file_path.name}")
            return None

        # Preprocess audio into 16kHz mono 64,600 samples
        pcm_data, duration, _ = preprocess_audio(content)

        # Run AASIST evaluation
        res = engine.predict(pcm_data, duration)
        score = float(res.get("aasist_score", 0.0))
        decision = res.get("decision", "UNKNOWN")

        # Evaluate correctness
        # For human: ALLOW is correct ('Y'), FLAGGED/BLOCK is incorrect ('N')
        # For AI: BLOCK is correct ('Y'), FLAGGED/ALLOW is incorrect ('N')
        if expected_label == "human":
            is_correct = "Y" if decision == "ALLOW" else "N"
        else:
            is_correct = "Y" if decision == "BLOCK" else "N"

        return {
            "filename": file_path.name,
            "expected": expected_label,
            "score": score,
            "decision": decision,
            "correct": is_correct
        }
    except Exception as e:
        print(f"[WARNING] Skipping {file_path.name} (Error: {e})")
        return None


def run_calibration(human_dir: Path, ai_dir: Path):
    print("=" * 65)
    print(" VoiceGuard AASIST Anti-Spoofing Calibration Tool")
    print(f" Thresholds: BLOCK >= {BLOCK_THRESHOLD:.2f} | FLAG >= {FLAG_THRESHOLD:.2f}")
    print("=" * 65)

    # Initialize neural engine
    engine = AASISTNeuralEngine()

    human_files = []
    if human_dir.exists() and human_dir.is_dir():
        human_files = sorted([
            f for f in human_dir.iterdir()
            if f.is_file() and f.suffix.lower() in SUPPORTED_EXTENSIONS
        ])

    ai_files = []
    if ai_dir.exists() and ai_dir.is_dir():
        ai_files = sorted([
            f for f in ai_dir.iterdir()
            if f.is_file() and f.suffix.lower() in SUPPORTED_EXTENSIONS
        ])

    total_files = len(human_files) + len(ai_files)
    if total_files == 0:
        print("\n[!] No audio files found to calibrate.")
        print(f"    - Human folder: {human_dir}")
        print(f"    - AI folder:    {ai_dir}")
        print("\nPlease drop .wav, .mp3, or other audio clips into those directories and rerun:")
        print("    python backend/calibrate.py\n")
        return

    results = []
    human_scores = []
    ai_scores = []

    print(f"\nProcessing {len(human_files)} human sample(s) and {len(ai_files)} AI sample(s)...\n")

    # 1. Process Human Samples
    for f in human_files:
        row = process_audio_file(engine, f, "human")
        if row:
            results.append(row)
            human_scores.append(row["score"])

    # 2. Process AI Samples
    for f in ai_files:
        row = process_audio_file(engine, f, "ai")
        if row:
            results.append(row)
            ai_scores.append(row["score"])

    if not results:
        print("\n[!] All candidate files failed to process or were skipped.")
        return

    # Print Clean Table
    print(f"{'FILE':<26} {'EXPECTED':<10} {'SCORE':<8} {'DECISION':<10} {'CORRECT?':<8}")
    print("-" * 65)
    for r in results:
        fname = r['filename']
        if len(fname) > 24:
            fname = fname[:21] + "..."
        print(f"{fname:<26} {r['expected']:<10} {r['score']:<8.3f} {r['decision']:<10} {r['correct']:<8}")

    print("-" * 65)

    # Compute Summary Stats
    human_avg = (sum(human_scores) / len(human_scores)) if human_scores else None
    ai_avg = (sum(ai_scores) / len(ai_scores)) if ai_scores else None

    summary_parts = []
    if human_avg is not None:
        summary_parts.append(f"Human avg: {human_avg:.3f}")
    else:
        summary_parts.append("Human avg: N/A (no samples)")

    if ai_avg is not None:
        summary_parts.append(f"AI avg: {ai_avg:.3f}")
    else:
        summary_parts.append("AI avg: N/A (no samples)")

    if human_avg is not None and ai_avg is not None:
        gap = ai_avg - human_avg
        summary_parts.append(f"Separation gap: {gap:.3f}")
    else:
        summary_parts.append("Separation gap: N/A")

    print("\n" + "   ".join(summary_parts) + "\n")

    # Additional Insight
    correct_count = sum(1 for r in results if r["correct"] == "Y")
    accuracy = (correct_count / len(results)) * 100
    print(f"Overall Accuracy: {correct_count}/{len(results)} ({accuracy:.1f}%)")
    if human_avg is not None and ai_avg is not None:
        midpoint = (human_avg + ai_avg) / 2
        print(f"Optimal Midpoint Threshold: {midpoint:.3f}")
        print("To update thresholds, edit BLOCK_THRESHOLD and FLAG_THRESHOLD at the top of backend/model/aasist_inference.py")
    print("=" * 65 + "\n")


def main():
    parser = argparse.ArgumentParser(
        description="VoiceGuard AASIST Anti-Spoofing Calibration Testing Tool"
    )
    parser.add_argument(
        "--human",
        type=str,
        default=str(CURRENT_DIR / "test_samples" / "human"),
        help="Path to folder containing real human audio samples"
    )
    parser.add_argument(
        "--ai",
        type=str,
        default=str(CURRENT_DIR / "test_samples" / "ai"),
        help="Path to folder containing synthetic AI clone audio samples"
    )

    args = parser.parse_args()

    human_dir = resolve_folder(args.human, "test_samples/human")
    ai_dir = resolve_folder(args.ai, "test_samples/ai")

    run_calibration(human_dir, ai_dir)


if __name__ == "__main__":
    main()
