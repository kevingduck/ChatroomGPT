import openai

from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)

openai.api_key=""

messages = {}

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/send_message/<room_id>", methods=["POST"])
def send_message(room_id):
    if room_id not in messages:
        messages[room_id] = []

    content = request.json
    name = content["name"]
    message = content["message"]
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    messages[room_id].append({"name": name, "message": message, "timestamp": timestamp})
    return jsonify({"status": "success"})


@app.route("/get_messages/<room_id>")
def get_messages(room_id):
    if room_id not in messages:
        messages[room_id] = []

    return jsonify(messages[room_id])


@app.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")


@app.route("/gpt/<room_id>", methods=["POST"])
def gpt(room_id):
    prompt = request.json["prompt"]
    model = request.json["model"]
    max_tokens = request.json["max_tokens"]
    response = openai.ChatCompletion.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "assistant", "content": "Provide examples"},
            {"role": "user", "content": prompt},
        ],
        temperature=0.8,
        max_tokens=max_tokens,
    )

    return jsonify({"response": response.choices[0].message.content})



@app.route("/send_gpt_response/<room_id>", methods=["POST"])
def send_gpt_response(room_id):
    if room_id not in messages:
        messages[room_id] = []

    content = request.json
    name = content["name"]
    message = content["message"]
    timestamp = content["timestamp"]
    messages[room_id].append({"name": name, "message": message, "timestamp": timestamp})
    return jsonify({"status": "success"})




if __name__ == "__main__":
    app.run(debug=True)
