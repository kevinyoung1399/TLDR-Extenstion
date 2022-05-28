/**
 * Query content script that popup is ready to collect input data.
 */
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, 
      {
        message: "open", 
      }, function(response) {
        if (response) {
          console.log(response.data)
        }
      })
})

/**
 * Recieve input data from content script.
 */
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

let summarizationInput = ''
/**
 * @param {String} input 
 */
function setSummarizationInput(input) {
  summarizationInput = input.replace("\n", "");
  console.log('Summarization Input: ' + summarizationInput);
}

// document.getElementById("test").addEventListener("click", test);
// function test() {
//   document.getElementById('test').style.display = "none";
//   sendExtractiveToContext([
//     'Blender is a free and open-source 3D computer graphics software toolset used for creating animated films, visual effects, art, 3D-printed models, motion graphics, interactive 3D applications, virtual reality, and, formerly, video games',
//     'The name Blender was inspired by a song by the Swiss electronic band Yello, from the album Baby, which NeoGeo used in its showreel.',
//     '[14][15][16] Some design choices and experiences for Blender were carried over from an earlier software application, called Traces, that Roosendaal developed for NeoGeo on the Commodore Amiga platform during the 1987–1991 period',
//     '[17]\n On January 1, 1998, Blender was released publicly online as SGI freeware',
//     '[1] NeoGeo was later dissolved, and its client contracts were taken over by another company'
//   ])
// }

document.getElementById("extract").addEventListener("click", extractText);
/**
 * Fetch extractive sum method.
 */
function extractText() {
  document.getElementById('extract').style.display = "none";
  document.getElementById('extract-loading').style.display = "block";
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
        document.getElementById('extract-loading').style.display = 'none';
        console.log(content)
        console.log('Extractive result' + content.summarizations);
        sendExtractiveToContext(content.summarizations)
      })();
  }

/**
* Send results to context script for highlighting
*/
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

/**
 * Recieve message from content script that highlighting is complete.
 */
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

/**
 * Update popup display to confirm highlghting is complete to user.
 */
 function showConfirmation() {
  document.getElementById('extractive-sum').innerText = 'Extractive summarization complete, TLDR sentences have been highlighted.'
}

/**
* Fetch abstractive sum method, update popup display accordingly.
*/
document.getElementById("abstract").addEventListener("click", abstractText);
function abstractText() {
    document.getElementById('abstract').style.display = "none";
    document.getElementById('abstract-loading').style.display = "block";
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
        console.log('Abstractive result' + content.summarizations);
        document.getElementById('abstract-loading').style.display = 'none';
        document.getElementById('abstractive-sum').innerText = content.summarizations
      })();
  }