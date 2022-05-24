from transformers import pipeline

class Abstractive:
    def __init__(self, input_paragraphs):
        """
        """
        self._input_paragraphs = input_paragraphs
        self._summarizations = []

    def collect_summarizations(self):
        """
        Gets most important 3
        :return: list : summarizations
        """
        summarizations = []
        for paragraph in self._input_paragraphs:
            summarizations.append(self.abstract(paragraph))
        self._summarizations = summarizations
        return summarizations

    def abstract(self, paragraph):
        """
        Gets most important with BERTSum
        :return: list : summarizations
        """
        summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        # summarizer = pipeline("summarization", model="./models/bart-large-cnn")
        summary_text = summarizer(paragraph, max_length=130, min_length=30, do_sample=False)[0]['summary_text']
        return summary_text
