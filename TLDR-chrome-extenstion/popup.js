chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, 
      {
          message: "open", 
      }, function(response) {
          console.log(response.data)
      })
})


chrome.runtime.onMessage.addListener(
  function(request, sender, response) {
      if (request.message === "send_input") {
        setSummarizationInput(request.summarization_input);
      }
      response({
        data: "Popup: Input recieved."
    }); 
  }
);

let paragraph = ''
async function setSummarizationInput(input) {
  paragraph = input
  console.log('Paragraph: ' + paragraph)
}


async function sendExtractiveToContext(extractiveOutput) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, 
        {
          message: "extractive result",
          extractiveOutput: extractiveOutput 
        }, function(response) {
          console.log(response.data)
        })
  })
}

document.getElementById("extract").addEventListener("click", extractText);
function extractText() {
    // color = random_hex_color_code();
    // console.log(color)
    // document.getElementById("abstractive-sum").style.color = color;
    document.getElementById('extract').style.visibility = "hidden";
    (async () => {
        const rawResponse = await fetch('http://127.0.0.1:5000/extractiveSummarize', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({paragraphs: [paragraph]})
        });
        const content = await rawResponse.json();
        console.log('Extractive result' + content);
        sendExtractiveToContext(content)
      })();
  }

document.getElementById("abstract").addEventListener("click", abstractText);
function abstractText() {
    // color = random_hex_color_code();
    // console.log(color)
    // document.getElementById("abstractive-sum").style.color = color;
    document.getElementById('abstract').style.visibility = "hidden";
    (async () => {
        const rawResponse = await fetch('http://127.0.0.1:5000/abstractiveSummarize', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({paragraphs: [paragraph]})
        });
        const content = await rawResponse.json();
        console.log(content);
        document.getElementById('abstractive-sum').innerText = content.summarizations[0]
      })();
  }


// fetchData();