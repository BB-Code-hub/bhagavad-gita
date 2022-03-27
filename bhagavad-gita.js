const axios = require('axios');
const cheerio = require('cheerio');
const FileSystem = require("fs");

const chapter = 18;
const verses = 78;

const url = "https://bhagavadgita.io/chapter/"+chapter+"/verse/";

let data = [];

let getData = async (html,index) => {
    const $ = cheerio.load(html);
    let text = $("p.verse-sanskrit").text();
    text = text.replace(/\n/g, " ");
    let content = text.split('॥');
    if(content.length > 4) {
        console.log("true");
    }
    let newText = content[0]+"||"+chapter+"."+index+"||";
    return newText;
};

async function generateVerse() {
    for (let i = 1; i <= verses; i++) {
        let newUrl = url + i;
        console.log(newUrl);
        await getVerses(newUrl, i).then((dataText) => {
            data.push(dataText);
        });
    }
    FileSystem.writeFile('bhagavad-gita/chapter18.txt', JSON.stringify(data.join(" "), null, 4), (err) => {
        if (err) throw err;
    });
}

function getVerses(newUrl, index) {
    return new Promise((resolve ,reject)=> {
        axios.get(newUrl).then(async response => {
            let val =  getData(response.data, index);
            resolve(val);
        }).catch(error => {
            console.log(error);
        });
    });
}


generateVerse();


