

function getNewSugestions(domainName) {
    console.log('getNewSugestions');
    const sugestions = [{ id: 101, name: domainName + '.patel.com', price: 9.95 },

    { id: 102, name: domainName + domainName.charAt(0) + '.patel.com', price: 9.95 },
    { id: 103, name: domainName + 'Bhai' + '.patel.com', price: 9.95 },
    { id: 104, name: domainName + 'BhaiPatel' + '.patel.com', price: 9.95 },
    { id: 105, name: domainName + domainName.charAt(0) + 'Patel' + '.patel.com', price: 9.95 },
    { id: 106, name: domainName + domainName.charAt(0) + 'Bhai' + '.patel.com', price: 9.95 },
    { id: 107, name: domainName + '_' + '.patel.com', price: 9.95 },
    { id: 108, name: domainName + '_Patel' + '.patel.com', price: 9.95 },
    { id: 109, name: domainName + "_bhai" + '_patel.com', price: 9.95 },
    { id: 110, name: "Bhai" + domainName + '.patel.com', price: 9.95 },
    { id: 111, name: "Bhai" + domainName + 'Patel' + '.patel.com', price: 9.95 }
    ];
    let domains = sugestions;
    let index;
   
    return domains
}

function getexistingDomainSugestions(domainName, existingDomains) {
    console.log('getexistingDomainSugestions');
    const sugestions = [{ id: 101, name: domainName + '.patel.com', price: 9.95 },

{ id: 102, name: domainName + domainName.charAt(0) + '.patel.com', price: 9.95 },
{ id: 103, name: domainName + 'Bhai' + '.patel.com', price: 9.95 },
{ id: 104, name: domainName + 'BhaiPatel' + '.patel.com', price: 9.95 },
{ id: 105, name: domainName + domainName.charAt(0) + 'Patel' + '.patel.com', price: 9.95 },
{ id: 106, name: domainName + domainName.charAt(0) + 'Bhai' + '.patel.com', price: 9.95 },
{ id: 107, name: domainName + '_' + '.patel.com', price: 9.95 },
{ id: 108, name: domainName + '_Patel' + '.patel.com', price: 9.95 },
{ id: 109, name: domainName + "_bhai" + '_patel.com', price: 9.95 },
{ id: 110, name: "Bhai" + domainName + '.patel.com', price: 9.95 },
{ id: 111, name: "Bhai" + domainName + 'Patel' + '.patel.com', price: 9.95 }
];

    let domains = sugestions;
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
        domains.splice(index, 1)
    }
   
 return domains
}

//getSugestions('Prabhat', 'Prabhat.patel.com');
module.exports.getNewSugestions = getNewSugestions
module.exports.getexistingDomainSugestions = getexistingDomainSugestions
