import {config} from './config';
import mongoConnect from './utils/mongoConnect';
import args from './utils/args';
import fs from 'fs';
import superagent from 'superagent';
import cheerio from 'cheerio';
import mapLimit from 'async/mapLimit';

import {sendToQueue} from './utils/send';

const baseUrl = 'http://jandan.net/duan';
var currentCount = 0;

superagent.get(baseUrl)
.end((err, response) => {
    if (err) {
        console.log("get baseUrl failed");
        return console.log(err);
    }
    let $ = cheerio.load(response.text);
    let currentMaximumPage = $('.current-comment-page').first().text();
    currentMaximumPage = parseInt(currentMaximumPage.substr(1, currentMaximumPage.length-2));

    // generate url, test first 20 page
    let urls = [];
    for(let i = currentMaximumPage; i > currentMaximumPage-config.page; i--) {
        let url = "http://jandan.net/duan/page-" + i;
        urls.push(url);
    }
    console.log(urls.length);

    // async crawl
    mapLimit(urls, config.interval,
    (url, callback)=>{
        console.log("current url is " + url);
        crawlAndParsePage(url, callback);
    },
    (err, result)=>{
        if (err) {
            console.log("error happened");
            console.log(err)
        }else {
            console.log("mapLimit done");
            // console.log(result)
        }
    })
})

function crawlAndParsePage(url, callback) {
    superagent.get(url)
    .end((err, response) => {
        if (err) {
            console.log("get " + url + " failed");
            return console.log(err);
        }
        let $ = cheerio.load(response.text);
        let duanziStore = duanziExtraction($);
        let idArray = duanziStore.map(item=>item.duanziId)
        sendToQueue("duanziList", idArray);

        // store
        if (args.mongodb == false) {
            // use file to store data
            fs.appendFileSync(args.file, JSON.stringify(duanziStore)+"\n")
        }else{
            mongoConnect("mongodb://localhost:27017/duanzi")
            .then(
                async (db)=>{
                    try {
                        const collection = db.collection('jandan');
                        const res = await collection.insertMany(duanziStore);
                        console.log("save content from " + url +" success");
                    }
                    catch(err) {
                        console.log("save error");
                        db.close();
                        throw err;
                    }
                    db.close();
                },
                (err)=>{
                    console.log("db connection error")
                    throw err;
                }
            )
            .catch((err)=>{
                console.log(err);
            })
        }

        // create a random delay and call callback function
        let delay = Math.random()*config.interval;
        setTimeout(function(){
            currentCount--;
            callback(null, "url is " + url + " delay is " + delay);
        },delay);
    })
}

function duanziExtraction($){
    let duanziStore = [];
    $('.commentlist li').each(function(idx, elem) {
        let commentLike = parseInt($(elem).find('.tucao-like-container span').text());
        let commentUnlike = parseInt($(elem).find('.tucao-unlike-container span').text());
        if (commentUnlike+ commentLike >= 50 && (commentLike / commentUnlike) < 0.618){
            // bad duanzi
        }else {
            let duanziId = $(elem).find(".righttext a").text()
            let pArray = $(elem).find("p")
            let duanziContent = ""
            pArray.each(function(index, element){
                duanziContent += $(element).text() + "\n"
            })
            duanziStore.push({
                duanziId,
                duanziContent,
                commentLike,
                commentUnlike
            })
        }
    })
    return duanziStore;
}
