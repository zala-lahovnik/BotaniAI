import express from 'express'
import puppeteer from 'puppeteer' // version 18.1.0
const app = express();

//CORS
import cors from 'cors'
import fs from "fs"
app.use(cors());
app.use(express.json());

const page_start = 'https://www.picturethisai.com/wiki/';
const page_ending = '.html'

app.get('/startScraping', async(req, res) => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    const originalSpecies = fs.readFileSync('species.json', 'utf-8')
    const speciesJSON = JSON.parse(originalSpecies)

    console.log('entries', Object.keys(speciesJSON))

    let collected_data = [];

    for(const number of Object.keys(speciesJSON)) {
        let plantInfo = {
            latin: '',
            common: '',
            description: '',
            watering: '',
            sunlight: '',
            plantingTime: '',
            soil: '',
            wateringDetail: '',
            fertilization: '',
            toxicity: '',
            folder_num: Number(number)
        }

        const name_array = speciesJSON[number].split(' ')

        const link_name = name_array[0] + '_' + name_array[1]

        await page.goto(`${page_start}${link_name}${page_ending}`)
    }

    fs.writeFileSync('plant_details.json', JSON.stringify(collected_data, null, 4))
    console.log('Saved to file')
    res.json(originalSpecies)
});

app.listen(8000);