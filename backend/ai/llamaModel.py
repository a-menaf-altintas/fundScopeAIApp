# backend/ai/llamaModel.py
import sys
import json
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# Determine the device: prefer MPS on macOS (Apple Silicon), then CUDA, then CPU.
if torch.backends.mps.is_available():
    device = "mps"
elif torch.cuda.is_available():
    device = "cuda"
else:
    device = "cpu"

print("Using device:", device)

def load_model():
    model_name = "meta-llama/Llama-2-7b-chat-hf"  # Use the 7B-chat model (which is more feasible than a 70B model on an M2)
    print("Loading tokenizer...", flush=True)
    tokenizer = AutoTokenizer.from_pretrained(model_name, use_auth_token=True)
    print("Loading model...", flush=True)
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        # Use float16 for both cuda and mps if available; adjust as needed if you experience issues.
        torch_dtype=torch.float16 if device in ["cuda", "mps"] else torch.float32,
        use_auth_token=True
    )
    model.to(device)
    return tokenizer, model

def generate_recommendation(user_input, tokenizer, model):
    # Create a prompt for the LLaMA-2 chat model
    prompt_template = (
        "You are an expert funding advisor. Based on the following company profile, "
        "provide a concise, structured funding recommendation. Do not repeat the input. "
        "Only output the recommendation without any extra preamble.\n"
        "Company Profile: \"{input}\"\n"
        "Funding Recommendation: "
    )
    prompt = prompt_template.format(input=user_input)
    
    inputs = tokenizer.encode(prompt, return_tensors="pt").to(device)
    
    with torch.no_grad():
        outputs = model.generate(
            inputs,
            max_length=350,
            num_return_sequences=1,
            do_sample=True,
            temperature=0.7,
            top_p=0.9,
            repetition_penalty=1.2
        )
    
    full_output = tokenizer.decode(outputs[0], skip_special_tokens=True)
    marker = "Funding Recommendation:"
    if marker in full_output:
        recommendation = full_output.split(marker, 1)[1].strip()
    else:
        recommendation = full_output.strip()
    return recommendation

if __name__ == "__main__":
    print("Python script started", flush=True)
    tokenizer, model = load_model()
    print("Model loaded successfully", flush=True)
    
    if len(sys.argv) > 1:
        user_input = sys.argv[1]
        print("Received input: " + user_input, flush=True)
        rec = generate_recommendation(user_input, tokenizer, model)
        output = {"recommendation": rec}
        print(json.dumps(output), flush=True)
    else:
        print("No user info provided", flush=True)