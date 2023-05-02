import openai

from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)

openai.api_key="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"

messages = []

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/send_message", methods=["POST"])
def send_message():
    content = request.json
    name = content["name"]
    message = content["message"]
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    messages.append({"name": name, "message": message, "timestamp": timestamp})
    return jsonify({"status": "success"})

@app.route("/get_messages")
def get_messages():
    return jsonify(messages)

@app.route("/gpt", methods=["POST"])
def gpt():
    prompt = request.json["prompt"]
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "assistant", "content": "Provide examples"},
            {"role": "user", "content": prompt},
        ],
        temperature=0.8,
        max_tokens=8000,
    )

    return jsonify({"response": response.choices[0].message.content})


if __name__ == "__main__":
    app.run(debug=True)
