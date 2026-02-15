import json

if __name__ == "__main__":
    with open("./artifacts/model_metadata.json", "r", encoding="utf-8") as f:
        metadata = json.load(f)
    print(json.dumps(metadata.get("metrics", {}), ensure_ascii=False, indent=2))
