"""BertSum model ,
available to use as a Python module, for the BertSum summarizations."""
from summarizer import Summarizer


class Extractive:
    """
    A class to process extractive summarizations using BertSum
    (Fine-tune BERT for Extractive Summarization - Yang Liu).
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
        Constructs attributes for the extraction object.
        """
        self._input_paragraphs = input_paragraphs
        self._summarizations = []

    # def collect_summarizations(self):
    #     """
    #     Gets most important 3
    #     :return: list : summarizations
    #     """
    #     summarizations = []
    #     for paragraph in self._input_paragraphs:
    #         summarizations.append(self.extract(paragraph))
    #     self._summarizations = summarizations
    #     return summarizations

    def extract(self):
        """
        Gets the sentences that create the summarization with BertSum.
        Returns
        -------
        summarizations : str
        """
        model = Summarizer()
        result = model(self._input_paragraphs[0], min_length=60)
        return result.split(".")
