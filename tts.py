# tts.py
from gtts import gTTS
from flask import Flask, request, send_file
import os
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/tts', methods=['POST'])
def text_to_speech():
    text = request.json.get('text')
    if not text:
        return {'error': 'No text provided'}, 400

    language = 'en'
    tts = gTTS(text=text, lang=language, slow=False)
    mp3_fp = io.BytesIO()
    tts.write_to_fp(mp3_fp)
    mp3_fp.seek(0)

    return send_file(mp3_fp, mimetype='audio/mpeg', as_attachment=True, download_name='summary.mp3')

if __name__ == '__main__':
    app.run(debug=True)