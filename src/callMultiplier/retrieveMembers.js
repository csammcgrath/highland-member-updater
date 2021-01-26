const prompt = require('prompt');
const puppeteer = require('puppeteer');
const callMultiplier = require('../constants/callMultiplier');

/**
 * Grab the username/password from the user to use at runtime - not storing anything 
 */
function promptUser(promptUserCallback) {
    let schema = {
        properties: {
            user: {
                pattern: /[a-zA-Z\d]*/,
                default: 'SamMcGrath'
            },
            password: {
                pattern: /[a-zA-Z\d]+/,
                message: 'Password must be only letters, and numbers.',
                replace: '*',
                hidden: true,
                required: true
            }
        }
    }

    prompt.start();

    prompt.get(schema, (err, results) => {
        if (err) promptUserCallback(err);

        promptUserCallback(null, results);
    })
}

/**
 * Begins the scraping process and goes through the table. It also fixes all of the weird stuff and returns
 * everything in a very nice array of objects that look like this:
 * [
 *   {
 *      name: Foobar
 *      phoneNumber: 123-555-3823
 *   }
 * ]
 * 
 * Note from dev: yes, this is very hacky. scraping php really sucks
 */
async function scrape(data, browser) {
    const page = await browser.newPage();

    await authenticate(data, page);

    await page.goto(callMultiplier.members);
    await page.waitForSelector(callMultiplier.banner);

    let members = await page.evaluate(() => {
        return [...document.querySelectorAll('table tbody tr')].map(tr => {
            return [...tr.querySelectorAll('td')].map(td => td.innerText);
        });
    });

    //fix members because callmultiplier does their webpage in a really crappy way :/
    members = members.filter(member => member.length != 2).slice(7).map(member => {
        return {
            'name': member[1].replace(/\t/g, '').replace(/\n/g, ''),
            'phoneNumber': member[2].replace(/\t/g, '').replace(/\D+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
        }
    });

    return members;
}

/**
 * Authenticate the program to CallMultiplier so it can begin scraping
 */
async function authenticate(data, page) {
    console.log('Authenticating on CallMultiplier...');

    await page.goto(callMultiplier.login);
    await page.waitForSelector(callMultiplier.fields.login.login);

    await page.evaluate(({data, callMultiplier}) => {
        document.querySelector(callMultiplier.fields.login.login).value = data.user;
        document.querySelector(callMultiplier.fields.login.password).value = data.password;
        document.querySelector(callMultiplier.fields.login.button).click();
    }, {data, callMultiplier});

    await page.waitForSelector(callMultiplier.banner);

    console.log('Authenticated!');
}

/**
 * Grab all of the current members in CallMultiplier
 */
async function retrieveMembers(data) {
    try {
        const browser = await puppeteer.launch({
            headless: false
        });
        const members = await scrape(data, browser);

        await browser.close();

        return members;
    } catch (err) {
        console.error(err);
        return;
    }
}

module.exports = {
    retrieveMembers,
    promptUser
}