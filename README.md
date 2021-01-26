# Highland Member Updater
Author: Sam McGrath  
Ward: Highland Park - Mesa, Arizona

## Introduction

Even though the project is named Highland Member Updater, it can be repurposed to fulfill your needs for your ward. It simply updates the CallMultiplier list according to the LDS.org. Account credentials are prompted at runtime (passwords are masked with `*`) so no need to worry about exposing your passwords. 

## Installation
1. Make sure that NodeJS is installed and make sure that it is installed through 
```bash
$ node -v
v12.8.1
```

2. Clone this repository and install the needed dependencies.
```bash
$ git clone git@github.com:csammcgrath/highland-member-updater.git
$ cd highland-member-updater
$ npm i
```

3. Once that is finished, log into lds.org and navigate to the directory. The URL should look something like this:
```bash
https://directory.churchofjesuschrist.org/1000446
```

4. Please make note of that unit number (1000446 in my case) and go into `constants/lds.js` and edit the `unitCode` variable to whatever your unit number is. Be sure to save the file.

5. You are pretty much ready to go! To execute the program, just run:
```bash
$ npm start
```

6. You will be prompted credentials for both CallMultiplier and lds.org. If they are incorrect, the program will just time out since I am lazy with implementing logic to detect failures. :) 
If this is the case, just execute Ctrl + C to cancel the program.

## FAQ
- Sir, I don't want to see Chromium pop up and do all of the work. Can it just do everything silently?  
Yes, change the `false` value to `true` in both `/callMultiplier/retrieveMembers.js` and `/lds/retrieveMembers.js` as shown below:
```bash
const browser = await puppeteer.launch({
    headless: false // <-- change this to true if you dont want to see Chromium
});
```

## Have any issues?
Please submit a ticket in the issues found [here](https://github.com/csammcgrath/highland-member-updater/issues) and I will do my best to get back to you. 

Pull requests are always welcome!