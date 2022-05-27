console.log('TLDR Extension is ready.')

function convertToPlain(html) {
    let tempDivElement = document.createElement("div");
    tempDivElement.innerHTML = html;
    return tempDivElement.textContent || tempDivElement.innerText || "";
}

const paragraphs = document.getElementsByTagName('p');
let validTexts = new Array (5);
// change to camel case
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

function highlightPage(extractiveOutput) {
    let updatedTexts = {}
    for (let i = 0; i < validTexts.length; i++) {
        let textNum = 'valid-paragraph-' + i 
        for (sentence of extractiveOutput) {
            if (validTexts[i].includes(sentence)) {
                console.log('Sentence found: ' + sentence)
                let regex = new RegExp(sentence,'g');
                if (updatedTexts[textNum]) { //////////////// how to check if key exists in dict
                    prevUpdatedText = updatedTexts[textNum];
                    newText =  prevUpdatedText.replace(regex,'<mark>'+ sentence +'</mark>' );
                    updatedTexts[textNum] = newText;
                } else {
                    newText =  validTexts[i].replace(regex,'<mark>'+ sentence +'</mark>' );
                    updatedTexts[textNum] = newText;
                }
            }
        }   
    }
    for (const [key, value] of Object.entries(updatedTexts)) {
        document.getElementById(key).innerHTML = value;
    }
    let marks = document.getElementsByTagName('mark');
    for (let mark of marks) {
        if (mark.outerHTML.includes('valid-paragraph-')) {
            mark.style['background-color'] = '#FF00FF'
        }
    }
    sendHighlightConfirmation()
}

chrome.runtime.onMessage.addListener(
    function(request, sender, response) {
        if (request.message === "open") {
            sendInput();
        }
        response({
            data: "Context: We detected you (Popup), text sent."
        })
    }
);

function sendInput() {
    chrome.runtime.sendMessage({
        message: "send_input",
        summarization_input: summarization_input
    }, function(response) {
        console.log(response.data)
    });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, response) {
        if (request.message === "extractive result") {
            console.log('Extractive Output: ' + request.extractiveOutput)
            highlightPage(request.extractiveOutput)
        } response({
            data: "Context: We've recieved your extractive results. Highlighting paragraph."
        })
    }
);

function sendHighlightConfirmation() {
    chrome.runtime.sendMessage({
        message: "confirm_highlight",
    }, function(response) {
        // console.log(response.confirmation)
    });
}
