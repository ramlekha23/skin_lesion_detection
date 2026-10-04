from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
import os
import time

app = Flask(__name__)
CORS(app)


# =========================================
# UPLOAD FOLDER
# =========================================

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


# =========================================
# GEMINI SETUP
# =========================================

api_key = os.environ.get("GEMINI_API_KEY")

if not api_key:
    print("WARNING: GEMINI_API_KEY is not set!")

client = genai.Client(api_key=api_key)


# =========================================
# HOME
# =========================================

@app.route("/", methods=["GET"])
def home():
    return "SkinCare AI Backend is Running!"


# =========================================
# IMAGE UPLOAD
# =========================================

@app.route("/upload", methods=["POST"])
def upload_image():

    try:

        if "image" not in request.files:
            return jsonify({
                "error": "No image received"
            }), 400

        image = request.files["image"]

        if image.filename == "":
            return jsonify({
                "error": "No image selected"
            }), 400

        file_path = os.path.join(
            UPLOAD_FOLDER,
            image.filename
        )

        image.save(file_path)

        return jsonify({
            "message": "Image uploaded successfully!",
            "filename": image.filename
        })

    except Exception as e:

        print("UPLOAD ERROR:")
        print(repr(e))

        return jsonify({
            "error": "Image upload failed"
        }), 500


# =========================================
# GEMINI CHATBOT
# =========================================

@app.route("/chat", methods=["POST"])
def chat():

    try:

        data = request.get_json(silent=True)

        if not data:

            return jsonify({
                "error": "No data received"
            }), 400

        user_message = data.get(
            "message",
            ""
        ).strip()

        if not user_message:

            return jsonify({
                "error": "Message is required"
            }), 400


        # =====================================
        # PROMPT
        # =====================================

        prompt = f"""
You are SkinGuard AI, a simple skincare assistant.

User question:
{user_message}

Rules:
- Give a short and simple answer.
- Maximum 2 to 4 sentences.
- Use easy English.
- Answer only what the user asked.
- Do not give unnecessary explanations or long lists.
- Give general skincare information only.
- Do not diagnose diseases.
- If medical attention may be needed, briefly suggest seeing a doctor.
"""


        # =====================================
        # GEMINI REQUEST
        # =====================================

        response = None

        for attempt in range(3):

            try:

                response = client.models.generate_content(
                    model="gemini-3.8-flash",
                    contents=prompt
                )

                break


            except Exception as e:

                error_text = str(e)

                print("Gemini error:")
                print(error_text)


                # =================================
                # 429 QUOTA ERROR
                # =================================

                if "429" in error_text:

                    return jsonify({
                        "error": "SkinGuard AI is temporarily unavailable. Please try again later."
                    }), 429


                # =================================
                # 503 TEMPORARY ERROR
                # =================================

                if "503" in error_text:

                    if attempt < 2:

                        time.sleep(
                            2 * (attempt + 1)
                        )

                        continue


                raise


        # =====================================
        # NO RESPONSE
        # =====================================

        if response is None:

            return jsonify({
                "error": "No response received."
            }), 500


        # =====================================
        # GEMINI REPLY
        # =====================================

        reply = getattr(
            response,
            "text",
            None
        )

        if not reply:

            return jsonify({
                "error": "No reply received from AI."
            }), 500


        return jsonify({
            "reply": reply
        }), 200


    # =========================================
    # GENERAL ERROR
    # =========================================

    except Exception as e:

        print("================================")
        print("CHAT ERROR:")
        print(repr(e))
        print("================================")

        return jsonify({
            "error": "Dermascan AI is temporarily unavailable."
        }), 500


# =========================================
# RUN SERVER
# =========================================

if __name__ == "__main__":

    print("================================")
    print("SkinCare AI Backend")
    print("Server: http://127.0.0.1:5000")
    print("================================")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
