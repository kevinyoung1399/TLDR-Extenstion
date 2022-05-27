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

chrome.runtime.onMessage.addListener(
  function(request, sender, response) {
      if (request.message === "confirm_highlight") {
        showConfirmation()
      }
      response({
        // data: "Popup: Highlight confirmation recieved."
    }); 
  }
);

let summarizationInput = ''
function setSummarizationInput(input) {
  summarizationInput = input
  console.log('Summarization Input: ' + summarizationInput)
}


function sendExtractiveToContext(extractiveOutput) {
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

function showConfirmation() {
  document.getElementById('extractive-sum').innerText = 'Extractive summuraization complete, TLDR sentences have been highlighted.'
}

document.getElementById("test").addEventListener("click", test);
function test() {
  sendExtractiveToContext([
    'Some design choices and experiences for Blender were carried over from an earlier software application, called Traces, that Roosendaal developed for NeoGeo on the Commodore Amiga platform during the 1987–1991 period',
    'The name Blender was inspired by a song by the Swiss electronic band Yello, from the album Baby, which NeoGeo used in its showreel.'
  ])
}


document.getElementById("extract").addEventListener("click", extractText);
function extractText() {
    document.getElementById('extract').style.visibility = "hidden";
    (async () => {
        const rawResponse = await fetch('http://127.0.0.1:5000/extractiveSummarize', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({paragraphs: [summarizationInput]})
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
          body: JSON.stringify({paragraphs: [summarizationInput]})
        });
        const content = await rawResponse.json();
        console.log(content);
        document.getElementById('abstractive-sum').innerText = content.summarizations[0]
      })();
  }


// fetchData();