module.exports = {
    'main': 'https://www.callmultiplier.com',
    'login': 'https://www.callmultiplier.com/login',
    'members': 'https://www.callmultiplier.com/interface/members.php?display=5000',
    'banner': 'body > div > div.ban-block.ban-block--loginned-user.text-center > div',
    'fields': {
        'login': {
            'login': '#contact-info > div > div.row.input-row > div:nth-child(1) > div > input',
            'password': '#contact-info > div > div.row.input-row > div:nth-child(2) > div > input',
            'button': '#contact-info > div > div.login-l-btn > button'
        },
        'members': {
            'table': 'body > div > div.login-interface-wrap > div > div.noborder-table-container.min-width-100 > div.d-none.d-lg-block.cm-d-print-block > form > table > tbody > tr',
            'name': 'td:nth-child(2)',
            'phoneNumber': 'td:nth-child(3)'
        }
    }
}