console.log('TLDR Extension is ready.')

/**
 * Convert String of HTML objects into a plain-text paragraph
 * @param {string} html - a String object of HTML Markup
 * @returns {string} - Plaintext paragraph with inner HTML tags (e.g. <a>) removed.
 */
function convertToPlain(html) {
    let tempDivElement = document.createElement("div");
    tempDivElement.innerHTML = html;
    return tempDivElement.textContent || tempDivElement.innerText || "";
}

/**
 * Get the first 5 paragraphs in the web-page to be input for summuraization.
 */
const paragraphs = document.getElementsByTagName('p');
let validTexts = new Array (5);
let summarization_input = ''
let i = 0
for (let paragraph of paragraphs) {
    if (i > 4) {
        break;
    } else {
        let text = convertToPlain(paragraph.innerHTML);
        if (text.length > 20 && text.length < 2000) {
            validTexts[i] = text
            summarization_input += text + ' '
            id_name = 'valid-paragraph-' + i
            paragraph.id = id_name
            paragraph.className = 'tldr'
            i += 1;
            // console.log('valid paragraph ' + id_name)
        }
    }
}

/**
 * Listen in for the popup if ready to collect the input data.
 */
 chrome.runtime.onMessage.addListener(
    function(request, sender, response) {
        if (request.message === "open") {
            sendInput();
        } response({
            data: "Context: We detected you (Popup), text sent."
        })
    }
);

/**
 * Send the text from the 5 paragraphs (input data) to the popup for processing.
 */
function sendInput() {
    chrome.runtime.sendMessage({
        message: "send_input",
        summarization_input: summarization_input
    }, function(response) {
        console.log(response.data)
    });
}

/**
 * Get the extractive summurization output from the popup to highlight the page.
 */
chrome.runtime.onMessage.addListener(
    function(request, sender, response) {
        if (request.message === "extractive result") {
            // console.log('Extractive Output: ' + request.extractiveOutput)
            highlightPage(request.extractiveOutput)
        } response({
            data: "Context: We've recieved your extractive results. Highlighting paragraph."
        })
    }
);

/**
 * Highlight the sentences on the page that are provided by the extractive output.
 * @param {*} extractiveOutput - The sentences the BERT model used to summurize the input text.
 */
 function highlightPage(extractiveOutput) {
    let output_sentences = []
    for (sent of extractiveOutput) {
        let new_sents = sent.toString().split('\n')
        for (const new_sent of new_sents) {
            if (new_sent.length > 5) {
                output_sentences.push(new_sent.trim());
            }
        }
    }

    let updatedTexts = {}
    for (let i = 0; i < validTexts.length; i++) {
        let textNum = 'valid-paragraph-' + i
        for (const sentence of output_sentences) {
            if (validTexts[i].includes(sentence)) {
                console.log('Sentence found: ' + sentence)
                if (updatedTexts[textNum]) {
                    prevUpdatedText = updatedTexts[textNum];
                    newText =  prevUpdatedText.replace(sentence,'<mark>'+ sentence +'</mark>' );
                    updatedTexts[textNum] = newText;
                } else {
                    newText =  validTexts[i].replace(sentence,'<mark>'+ sentence +'</mark>' );
                    updatedTexts[textNum] = newText;
                }
            }
        }   
    }
    for (const [key, value] of Object.entries(updatedTexts)) {
        document.getElementById(key).innerHTML = value;
    }
    sendHighlightConfirmation()
}

/**
 * Send a message to the popup to confirm highlighting is complete.
 */
function sendHighlightConfirmation() {
    chrome.runtime.sendMessage({
        message: "confirm_highlight",
    }, function(response) {
        // console.log(response.confirmation)
    });
}
