"""Module for downstream tasks, required to run the BART summarizer"""
from transformers import pipeline


def collect_abstractive_summarizations(input_paragraphs):
    """
    Creates a list of all the summarizations.
    Params
    -------
    input_paragraphs : str list
    Returns
    -------
    summarizations : str list
    """
    summarizations = []
    for paragraph in input_paragraphs:
        summarizations.append(abstract(paragraph))
    return summarizations


def abstract(paragraph):
    """
    Creates the summarization using the Huggingface BART model.
    Params
    -------
    paragraph : str
    Returns
    -------
    summary_text : str
    """
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    # summarizer = pipeline(
    # "summarization", model="./models/bart-large-cnn")
    summary_text = summarizer(
        paragraph, max_length=130, min_length=30, do_sample=False)
    summary_text = summary_text[0]['summary_text']
    return summary_text
