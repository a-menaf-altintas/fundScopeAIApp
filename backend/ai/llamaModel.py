# backend/ai/llamaModel.py
import sys
import json
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# Use CUDA if available, else CPU.
device = "cuda" if torch.cuda.is_available() else "cpu"

def load_model():
    # Use a public model (since you don't have a Hugging Face account).
    model_name = "facebook/opt-350m"
    print("Loading tokenizer...", flush=True)
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    print("Loading model...", flush=True)
    model = AutoModelForCausalLM.from_pretrained(model_name).to(device)
    return tokenizer, model

def generate_recommendation(user_input, tokenizer, model):
    inputs = tokenizer.encode(user_input, return_tensors="pt").to(device)
    with torch.no_grad():
        outputs = model.generate(
            inputs,
            max_length=300,         # Increase max length if needed
            num_return_sequences=1,
            do_sample=True,         # Enable sampling
            temperature=0.8,        # Adjust temperature (0.7-1.0 can work well)
            top_p=0.9,              # Use nucleus sampling for diversity
            repetition_penalty=1.2  # Penalize repetitive phrases
        )
    recommendation = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return recommendation



if __name__ == "__main__":
    print("Python script started", flush=True)
    tokenizer, model = load_model()
    print("Model loaded successfully", flush=True)
    
    if len(sys.argv) > 1:
        user_input = sys.argv[1]
        print("Received: " + user_input, flush=True)
        rec = generate_recommendation(user_input, tokenizer, model)
        # Output a single JSON object with the recommendation.
        output = {"recommendation": rec}
        print(json.dumps(output), flush=True)
    else:
        print("No user info provided", flush=True)
