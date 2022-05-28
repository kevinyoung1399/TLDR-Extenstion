"""Flask, a web framework used for processing the POST requests. """
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from abstractive import Abstractive
from extractive import Extractive


app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    """
    GET request to verify Flask server is running.
    """
    return "Hello, Flask!"


@app.route("/extractiveSummarize", methods=['POST'], endpoint='extractive')
def handle_extractive():
    """
    Process extractiveSummarize POST request.
    """
    if not request.json or 'paragraphs' not in request.json:
        abort(400, 'No data found to summarize.')
    ext = Extractive(request.json['paragraphs'])
    # summarizations = ext.collect_summarizations()
    summarizations = ext.extract()
    return jsonify({'summarizations': summarizations})


@app.route("/abstractiveSummarize", methods=['POST'], endpoint='abstractive')
def handle_abstractive():
    """
    Process abstractiveSummarize POST request.
    """
    if not request.json or 'paragraphs' not in request.json:
        abort(400, 'No data found to summarize.')
    abst = Abstractive(request.json['paragraphs'])
    summarizations = abst.collect_summarizations()
    return jsonify({'summarizations': summarizations})
