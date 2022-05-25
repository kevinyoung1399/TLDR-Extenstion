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
            // console.log(text)
            texts[num_valid_paragraphs] = text
            summarization_input += text + ' '
            num_valid_paragraphs += 1;
        }
    }
}
console.log(summarization_input)

// elt.style['background-color'] = '#FF00FF'