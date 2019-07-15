

function getNewSugestions(domainName) {
    console.log('getNewSugestions');
    const sugestions = [{ id: 101, name: 'Patel.com/' + domainName, price: 9.95 },
    { id: 102, name: 'Patel.com/' + domainName + domainName.charAt(0), price: 9.95 },
    { id: 103, name: 'Patel.com/' + domainName + 'Bhai' + '.', price: 9.95 },
    { id: 104, name: 'Patel.com/' + domainName + 'BhaiPatel', price: 9.95 },
    { id: 105, name: 'Patel.com/' + domainName + domainName.charAt(0) + 'Patel', price: 9.95 },
    { id: 106, name: 'Patel.com/' + domainName + domainName.charAt(0) + 'Bhai', price: 9.95 },
    { id: 107, name: 'Patel.com/' + domainName + '_', price: 9.95 },
    { id: 108, name: 'Patel.com/' + domainName + '_Patel', price: 9.95 },
    { id: 109, name: 'Patel.com/' + domainName + "_bhai", price: 9.95 },
    { id: 110, name: 'Patel.com/' + "Bhai" + domainName, price: 9.95 },
    { id: 111, name: 'Patel.com/' + "Bhai" + domainName + 'Patel', price: 9.95 }
    ];
    let domains = sugestions;
    let index;

    return {
        message: true,
        sugestions: domains.slice(0, 5)
    }

}

function getexistingDomainSugestions(domainName, existingDomains, domainName) {
    console.log('getexistingDomainSugestions' + domainName);
    const sugestions = [{ id: 101, name: 'Patel.com/' + domainName, price: 9.95 },
    { id: 102, name: 'Patel.com/' + domainName + domainName.charAt(0), price: 9.95 },
    { id: 103, name: 'Patel.com/' + domainName + 'Bhai' + '.', price: 9.95 },
    { id: 104, name: 'Patel.com/' + domainName + 'BhaiPatel', price: 9.95 },
    { id: 105, name: 'Patel.com/' + domainName + domainName.charAt(0) + 'Patel', price: 9.95 },
    { id: 106, name: 'Patel.com/' + domainName + domainName.charAt(0) + 'Bhai', price: 9.95 },
    { id: 107, name: 'Patel.com/' + domainName + '_', price: 9.95 },
    { id: 108, name: 'Patel.com/' + domainName + '_Patel', price: 9.95 },
    { id: 109, name: 'Patel.com/' + domainName + "_bhai", price: 9.95 },
    { id: 110, name: 'Patel.com/' + "Bhai" + domainName, price: 9.95 },
    { id: 111, name: 'Patel.com/' + "Bhai" + domainName + 'Patel', price: 9.95 }
    ];

    let domains = {
        message: 'Sorry ' + domainName + '.patel.com is not available',
        sugestions
    }
    let index;
    for (let d in existingDomains) {
        for (let key in sugestions) {
            if (sugestions[key].name === existingDomains[d]) {
                // console.log('465673');
                // console.log(key, sugestions.slice(key, 1))
                index = key
                console.log('key', key);
            }
        }
        domains.sugestions.splice(index, 1)

    }
    return {
        message: false,
        sugestions: domains.sugestions.slice(0, 5)
    }
}

//getSugestions('Prabhat', 'Prabhat.patel.com');
module.exports.getNewSugestions = getNewSugestions
module.exports.getexistingDomainSugestions = getexistingDomainSugestions
