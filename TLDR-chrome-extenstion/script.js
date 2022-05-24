// async function fetchData() {
//     const res=await fetch ("https://api.coronavirus.data.gov.uk/v1/data");
//     const record=await res.json();
//     document.getElementById("date").innerHTML=record.data[0].date;
//     document.getElementById("areaName").innerHTML=record.data[0].areaName;
//     document.getElementById("latestBy").innerHTML=record.data[0].latestBy;
//     document.getElementById("deathNew").innerHTML=record.data[0].deathNew;
// }


// function random_hex_color_code() {
//     let n = (Math.random() * 0xfffff * 1000000).toString(16);
//     return '#' + n.slice(0, 6);
//   };

//function find paragraphs
// documentId"paragraph" -> 3 Paragraphs found ready to summarise.

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
          body: JSON.stringify({paragraphs: ['Hello my name is Kevin and I like cheese', 'Bob is a dog, sally is a nice cat and good friend', 'Chicken is a good snack one of a kind']})
        });
        const content = await rawResponse.json();
        console.log(content);
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
          body: JSON.stringify({paragraphs: ['Hello my name is Kevin and I like cheese', 'Bob is a dog, sally is a nice cat and good friend', 'Chicken is a good snack one of a kind']})
        });
        const content = await rawResponse.json();
        console.log(content);
        document.getElementById('abstractive-sum-1').innerText = content.summarizations[0]
        document.getElementById('abstractive-sum-2').innerText = content.summarizations[1]
        document.getElementById('abstractive-sum-3').innerText = content.summarizations[2]
      })();
  }


// fetchData();