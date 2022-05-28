"""Module for downstream tasks, required to run the BART summarizer"""
from transformers import pipeline


class Abstractive:
    """
    A class to process abstractive summarizations using BART.
    ...
    Attributes
    ----------
    input paragraphs : str
        paragraphs to summarize.
    summarizations : list
        sentences that are output from the BertSum, used for the summarization.
    """

    def __init__(self, input_paragraphs):
        """
        """
        self._input_paragraphs = input_paragraphs
        self._summarizations = []

    def collect_summarizations(self):
        """
        Creates a list of all the summarizations.
        Returns
        -------
        summarizations : str
        """
        summarizations = []
        for paragraph in self._input_paragraphs:
            summarizations.append(self.abstract(paragraph))
        self._summarizations = summarizations
        return summarizations

    def abstract(self, paragraph):
        """
        Creates the summarization using the Huggingface BART model.
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
