const getController = require('../controllers');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return createData('role', roleData)
                .then(() => {
                    return createData('permission', permissionData);
                })
                .then(permissions => {
                    let param = permissions.map(item => ({
                        permit_id: item.id,
                        role_id: roleData.id
                    }));

                    return createData('role_permission', param);
                })
                .then(() => {
                    return createData('user', userData);
                });
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('tbl_user', null, {})
        .then(() => queryInterface.bulkDelete('tbl_role', null, {}));
    }
};

const createData = (controllerName, param) => {
    return new Promise((resolve, reject) => {
        const controller = getController(controllerName);
        let method = '';

        if (Array.isArray(param)) {
            method = 'bulkCreate';
            param = {
                data: param
            }
        }
        else
            method = 'create';

        controller[method](param, (err, result) => {
            if (err)
                return reject(err);
            
            return resolve(result);
        })
    });
}

const permissionData = [
    {
        permit_type: 'S',
        name_en: 'User Management',
        name_th: 'จัดการผู้ใช้',
        permit_path: '/user',
        permit_order: 2010,
        permit_key: 'user',
        permit_module: 'user',
        permit_icon: 'person'
    },
    {
        permit_type: 'S',
        name_en: 'Role Management',
        name_th: 'จัดการสิทธิ์การใช้งาน',
        permit_path: '/role',
        permit_order: 2020,
        permit_key: 'role',
        permit_module: 'role',
        permit_icon: 'group_work'
    },
    {
        permit_type: 'M',
        name_en: 'Category Management',
        name_th: 'จัดการหมวดสินค้า',
        permit_path: '/product_category',
        permit_order: 3010,
        permit_key: 'product_category',
        permit_module: 'product_category',
        permit_icon: 'category'
    },
    {
        permit_type: 'M',
        name_en: 'Product Management',
        name_th: 'จัดการสินค้า',
        permit_path: '/product',
        permit_order: 3020,
        permit_key: 'product',
        permit_module: 'product',
        permit_icon: 'list_alt'
    },
    {
        permit_type: 'R',
        name_en: 'Dashboard',
        name_th: 'Dashboard',
        permit_path: '/dashboard',
        permit_order: 1000,
        permit_key: 'dashboard',
        permit_module: '',
        permit_icon: 'dashboard'
    },
]

const roleData = {
    id: 1,
    role_name: 'Administrator'
}

const userData = {
    full_name: 'Administrator',
    username: 'admin',
    passwd: 'admin',
    role_id: 1
}