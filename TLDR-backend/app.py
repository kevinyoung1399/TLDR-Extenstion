from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from summarizers.Abstractive import Abstractive#
from summarizers.Extractive import Extractive

from flask import Flask
app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Hello, Flask!"

@app.route("/extractiveSummarize", methods=['POST'], endpoint='extractive')
def handleExtractive():
    if not request.json or not 'paragraphs' in request.json:
        abort(400, 'No data found to summarize.')
    ext = Extractive(request.json['paragraphs'])
    summarizations = ext.collect_summarizations()
    return jsonify({'summarizations': summarizations})

@app.route("/abstractiveSummarize", methods=['POST'], endpoint='abstrictive')
def handleAbstractive():
    if not request.json or not 'paragraphs' in request.json:
        abort(400, 'No data found to summarize.')
    abs = Abstractive(request.json['paragraphs'])
    summarizations = abs.collect_summarizations()
    return jsonify({'summarizations': summarizations})