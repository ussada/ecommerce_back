module.exports = function(sequelize, DataTypes) {
	return sequelize.define('permission', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'permit_id'
		},
		permit_type: {
			type: DataTypes.STRING(10),
			allowNull: false,
			defaultValue: ''
		},
		name_en: {
			type: DataTypes.STRING(100),
			allowNull: false,
			defaultValue: ''
		},
		name_th: {
			type: DataTypes.STRING(100),
			allowNull: false,
			defaultValue: ''
		},
		permit_path: {
			type: DataTypes.STRING(100),
			allowNull: false,
			defaultValue: ''
		},
		permit_order: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		permit_key: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: ''
		},
		permit_module: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: ''
		},
		permit_icon: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: ''
        },
        permit_status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 1
        }
	}, {
		tableName: 'tbl_permission'
	});
};
