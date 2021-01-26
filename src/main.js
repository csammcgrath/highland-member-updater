const csv = require('./createCsv');
const lds = require('./lds/retrieveMembers');
const { promisify } = require('util');
const callMultiplier = require('./callMultiplier/retrieveMembers');

const cmLogin = promisify(callMultiplier.promptUser);
const ldsLogin = promisify(lds.promptUser);

function findComplement(setA, setB) {
    let notFoundInSetB = [];

    for (let a of setA) {
        if (!setB.some(b => b.name.includes(a.name))) {
            notFoundInSetB.push(a);
        }
    }

    return notFoundInSetB;
}

(async () => {
    console.log('Please enter your CallMultiplier information:');
    const callMultiplierLoginInfo = await cmLogin();

    console.log('Please enter your LDS.org information:');
    const ldsLoginInfo = await ldsLogin();

    console.log('Thank you. Now retrieving members from CallMultiplier.')
    const callMultiplierMembers = await callMultiplier.retrieveMembers(callMultiplierLoginInfo);

    console.log('Successfully retrieved members from CallMultiplier! Now retrieving members from LDS.')
    const ldsMembers = await lds.retrieveMembers(ldsLoginInfo);
    console.log('Successfully retrieved members from LDS.org! Now retrieving the complement of the two.');

    // console.log(callMultiplierMembers, ldsMembers);
    console.log('No longer in the ward so these people will need to be removed.')
    const movedOut = findComplement(callMultiplierMembers, ldsMembers);
    console.log(movedOut);

    console.log('These members are not found in CallMultiplier.');
    const movedIn = findComplement(ldsMembers, callMultiplierMembers);

    console.log('Creating CSV file');
    await csv.createCsv(movedIn);
})();