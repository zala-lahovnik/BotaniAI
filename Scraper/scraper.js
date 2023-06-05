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
        console.log('link', page_start+link_name+page_ending)

        const latinNameTag = await page.$('.basic-information-latin-name')
        if(latinNameTag) {
            const latinName = await latinNameTag.evaluate(node => node.innerText)
            plantInfo.latin = latinName.trim()

            const commonNameTag = await page.$('.basic-information-prefer-name')
            const commonName = await commonNameTag.evaluate(node => node.innerText)
            plantInfo.common = commonName.trim()

            const descriptionTag = await page.$('.basic-information-description')
            const description = await descriptionTag.evaluate(node => node.innerText)
            plantInfo.description = description.trim()

            const basic_info_items = await page.$$('.basic-information-item ')

            for(const basic_info_item of basic_info_items) {
                const toxicityTag = await basic_info_item.$('.basic-information-item-content')
                const toxicity = await toxicityTag.evaluate(node => node.innerText)

                if(toxicity.includes('Toxic'))
                    plantInfo.toxicity = toxicity.trim()
            }

            const care_items = await page.$$('.care-guide-item');

            for (const item of care_items) {
                const detailTitleTag = await item.$('.care-guide-item-title-text')
                const detailTitle = await detailTitleTag.evaluate(node => node.innerHTML)

                const detailContentTag = await item.$('.care-guide-item-content')
                if(detailContentTag) {
                    const detailContent = await detailContentTag.evaluate(node => node.innerText)
                    // console.log('detailContent', detailContent)
                    if(detailTitle === 'Water') {
                        const waterTag = await item.$('.care-guide-item-content > div')
                        const water = await waterTag.evaluate(node => node.innerText)

                        plantInfo.wateringDetail = detailContent.trim().replaceAll('Water\n', '')
                        if(water !== 'Water') {
                            plantInfo.wateringDetail = water.replaceAll('Water\n', '')
                        }
                    }
                    if(detailTitle === 'Planting Time')
                        plantInfo.plantingTime = detailContent.trim().replaceAll('Planting Time\n', '')
                    if(detailTitle === 'Sunlight')
                        plantInfo.sunlight = detailContent.trim().replaceAll('Sunlight\n', '')
                    if(detailTitle === 'Soil')
                        plantInfo.soil = detailContent.trim().replaceAll('Soil\n', '')
                    if(detailTitle === 'Fertilization')
                        plantInfo.fertilization = detailContent.trim().replaceAll('Fertilization\n', '')
                }
            }

            const shortened_care = await page.$$('.care-guide-download-item')

            for(const short of shortened_care) {
                const shortenedTitleTag = await short.$('.care-guide-download-item-text-1')
                const shortenedTitle = await shortenedTitleTag.evaluate(node => node.innerText)

                const shortenedCareDescTag = await short.$('.care-guide-download-item-text-2')
                const shortenedCareDesc = await shortenedCareDescTag.evaluate(node => node.innerText)

                if(shortenedTitle === 'Water')
                    plantInfo.watering = shortenedCareDesc.trim()
                if(shortenedTitle === 'Sunlight')
                    plantInfo.sunlight = shortenedCareDesc.trim().replaceAll('Sunlight\n', '')
                if(shortenedTitle === 'Planting Time')
                    plantInfo.plantingTime = shortenedCareDesc.trim()
            }
            if(plantInfo.watering === '')
                plantInfo.watering = 'Every week'
            if(plantInfo.soil === '')
                plantInfo.soil = 'Neutral'
            if(plantInfo.sunlight === '')
                plantInfo.sunlight = 'Full sun'

        } else {
            plantInfo.latin = name_array[0] + ' ' + name_array[1]
            plantInfo.folder_num = Number(number)
            plantInfo.soil = 'Neutral'
            plantInfo.watering = 'Every week'
            plantInfo.sunlight = 'Full sun'
        }
        collected_data.push(plantInfo)
    }

    fs.writeFileSync('plant_details.json', JSON.stringify(collected_data, null, 4))
    console.log('Saved to file')
    res.json(originalSpecies)
});

app.listen(8000);