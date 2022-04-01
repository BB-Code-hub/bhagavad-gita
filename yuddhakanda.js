const axios = require('axios');
const cheerio = require('cheerio');
const FileSystem = require("fs");

const totalSargas = 128;

const url = "https://www.valmikiramayan.net/utf8/yuddha/sarga";

let data = [];

let getData = async (html,index) => {
    let slokaText = '';
    const $ = cheerio.load(html);
    let val = 0;
    $("body p.SanSloka").each((i, ele) => {
        let elem = $(ele).clone();
        elem.find("br").replaceWith(" ");
        let text = elem.text();
        let tempText = text.replace(/\|\|(.*)/g, (match, $1) => {
            val++;
            return "||6." + index + "." + val + "|| ";
        });
        console.log(tempText);
        slokaText = slokaText + tempText;

    });

    return slokaText;
};

async function generateKanda() {
    for (let i = 1; i <= totalSargas; i++) {
        let newUrl = url + i+"/yuddhasans"+i+".htm";
        console.log(newUrl);
        await getSargas(newUrl, i).then((dataText) => {
            dataText = dataText.replace(/\n/g, "");
            data.push(dataText);
        });
    }
    let final = JSON.stringify(data.join(), null, 4)
    FileSystem.writeFile('yuddhakanda-devangiri/yuddhakanda.txt', final, (err) => {
        if (err) throw err;
    });
}

function getSargas(newUrl, index) {
    return new Promise((resolve ,reject)=> {
        axios.get(newUrl).then(async response => {
            let val =  getData(response.data, index);
            resolve(val);
        }).catch(error => {
            console.log(error);
        });
    });
}



generateKanda();


