"""BertSum model ,
available to use as a Python module, for the BertSum summarizations."""
from summarizer import Summarizer

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


def extract(input_paragraphs):
    """
    Gets the sentences that create the summarization with BertSum.
    Params
    -------
    input_paragraphs : str
    Returns
    -------
    result : str list
    """
    model = Summarizer()
    result = model(input_paragraphs[0], min_length=60)
    return result.split(".")
