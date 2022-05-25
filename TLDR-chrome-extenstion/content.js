console.log('Hello')

function convertToPlain(html) {
    let tempDivElement = document.createElement("div");
    tempDivElement.innerHTML = html;
    return tempDivElement.textContent || tempDivElement.innerText || "";
}

let paragraphs = document.getElementsByTagName('p');
let texts = new Array (5);
let summarization_input = ''
let num_valid_paragraphs = 0;
for (const paragraph of paragraphs) {
    if (num_valid_paragraphs > 4) {
        break;
    } else {
        let text = convertToPlain(paragraph.innerHTML);
        if (text.length > 20 && text.length < 2000) {
            texts[num_valid_paragraphs] = text
            summarization_input += text + ' '
            num_valid_paragraphs += 1;
        }
    }
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

async function sendInput() {
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
            console.log(request.extractiveOutput)
        } response({
            data: "Context: We recieved your extractive results. Highlighting paragraph."
        })
    }
);


// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         if (request.message === "autoFill")
//             autoFill(request.textToFill);
//     }
// );

// async function autoFill(textToFill){ // here write your function...
//     console.log(textToFill)
// }

// elt.style['background-color'] = '#FF00FF'