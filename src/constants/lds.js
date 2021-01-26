const unitCode = '1000446';

module.exports = {
    'main': 'https://www.churchofjesuschrist.org/?lang=eng',
    'login': 'https://id.churchofjesuschrist.org/',
    'directory': `https://directory.churchofjesuschrist.org/${unitCode}`,
    'api': `/api/v4/households?unit=${unitCode}`,
    'directorySelector': '#PFheadSpace',
    'fields': {
        'login': {
            'username': '#okta-signin-username',
            'usernameButton': '#okta-signin-submit',
            'usernameSelector': '#form1 > div.o-form-content.o-form-theme.clearfix',
            'passwordScreenSelector': '#okta-sign-in > div.auth-content > div > div > div > p',
            'password': 'input[type=password]',
            'passwordButton': 'input[type=submit]',
            'passwordSelector': '#platform > div'
        }
    }
};