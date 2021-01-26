const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const filepath = `${__dirname}/out/out_${Date.now()}.csv`;

function createCsv(data) {
    fs.writeFile(filepath, '', { flag: 'w' }, err => {
        if (err) return console.error(err);
    });

    const csvWriter = createCsvWriter({
        path: filepath,
        header: [
            {
                id: 'name',
                title: 'Name'
            },
            {
                id: 'phoneNumber',
                title: 'Voice Phone'
            },
            {
                id: 'phoneNumber',
                title: 'Text Number'
            }
        ]
    });

    csvWriter.writeRecords(data).then(() => console.log('CSV file created!'));

}

module.exports = {
    createCsv
}