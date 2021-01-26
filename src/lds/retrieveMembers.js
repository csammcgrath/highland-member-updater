const prompt = require('prompt');
const puppeteer = require('puppeteer');
const lds = require('../constants/lds');

/**
 * Grab the username/password from the user to use at runtime - not storing anything 
 */
function promptUser(promptUserCallback) {
    let schema = {
        properties: {
            user: {
                pattern: /[a-zA-Z\d]*/,
                default: 'csammcgrath'
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
    });
}

function fixPhoneNumber(number) {
    return number.replace(/\D+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
}

/**
 * Members in LDS Tools that have no numbers associated with them
 * 
 * Note from dev: Have to maintain this unfortunately :(
 */
function getActualMembers() {
    return [
        'Allred, Briana',
        'Berry, William Henry',
        'Clifford, Cole',
        'Everett, Marni',
        'Everett, Peyton',
        'Fixico, Keytha John',
        'John, Isabella Naomi',
        'Price, Emmalee Sarah'
    ];
}

/**
 * People who have expressed no desire to be part of the text group.
 */
function getBlacklist() {
    return [
        'Sawka, Hayli Gail',
        'Kartchner, Chanel',
        'Williams, Kira',
        'Quilcat, Linda Leslie'
    ];
}

/**
 * Intercept the call out to the households endpoint in the api and capture the json object that is returned
 * thus circumnavigating the need for API authentication (which will be impossible considering that I dont work for
 * the church)
 */
async function getMembers(data, browser) {
    const page = await browser.newPage();

    await authenticate(data, page);

    await page.goto(lds.directory);

    //quick way to grab the network response from the API :)
    const [response] = await Promise.all([
        page.waitForResponse(response => response.url().includes('/api/v4/households?unit=1000446')),
    ]);

    let members = await response.json();
    const actualMembersWithNoPhoneNumbers = getActualMembers();
    const blacklist = getBlacklist();

    //fix members
    return members.filter(member => !blacklist.includes(member.name)).map(member => {
        if (actualMembersWithNoPhoneNumbers.includes(member.name)) {
            return {
                'name': member.name,
                'phoneNumber': 'system'
            };
        }

        let phoneNumber = undefined;

        if (member.phone === undefined) {
            for (let ele of member.members) {
                if (member.name === ele.name) {
                    phoneNumber = ele.phone;
                    break;
                }
            }
        } else {
            phoneNumber = member.phone;
        }

        return {
            'name': member.name,
            'phoneNumber': phoneNumber === undefined ? undefined : fixPhoneNumber(phoneNumber)
        };
    }).filter(member => member.phoneNumber != undefined);
}

/**
 * Authenticate the program to lds.org so it can begin scraping
 */
async function authenticate(data, page) {
    console.log('Authenticating on lds.org...');

    await page.goto(lds.login);
    await page.waitForSelector(lds.fields.login.usernameSelector);

    await page.type('#okta-signin-username', data.user, {delay: 20});
    await page.$eval('#okta-signin-submit', buttonElement => buttonElement.click());

    await page.waitForSelector(lds.fields.login.passwordScreenSelector);

    await page.type(lds.fields.login.password, data.password, {delay: 20});
    await page.click(lds.fields.login.passwordButton);

    await page.waitForSelector(lds.fields.login.passwordSelector);

    console.log('Authenticated!');
}

/**
 * Grab all of the current members in lds.org
 */
async function retrieveMembers(data) {
    try {
        const browser = await puppeteer.launch({
            headless: false
        });
        const members = await getMembers(data, browser);

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