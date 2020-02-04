module.exports = function(sequelize, DataTypes) {
	return sequelize.define('role', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'role_id'
		},
		role_name: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: ''
        },
        role_status: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: 'A'
        }        
	}, {
		tableName: 'tbl_role'
	});
};
