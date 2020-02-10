const user = {
    moduleName: 'user',
    newData: {
        username: 'test',
        passwd: 'test',
        full_name: 'Testing User',
        role_id: null
    },
    updateData: {
        full_name: 'Updated Testing Role',
        passwd: 'newpass'
    },
    validateFieldsException: [
        'passwd'
    ]
}

const role = {
    moduleName: 'role',
    newData: {
        role_name: 'Testing Role',
    },
    updateData: {
        role_name: 'Updated Testing Role'
    }
}

const category = {
    moduleName: 'category',
    newData: {
        cat_name: 'Testing Category',
    },
    updateData: {
        cat_name: 'Updated Testing Category'
    }
}

const product = {
    moduleName: 'product',
    newData: {
        cat_id: null,
        prod_name: 'Testing Product',
        prod_price: 100.25,
        prod_qty: 10
    },
    updateData: {
        prod_name: 'Updated Testing Product',
        prod_price: 200.75,
        prod_qty: 20
    }
}

module.exports = [
    user,
    role,
    category,
    product
]