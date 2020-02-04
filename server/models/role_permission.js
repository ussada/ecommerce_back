module.exports = function(sequelize, DataTypes) {
	const role_permission = sequelize.define('role_permission', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'role_permit_id'
		},
		role_id: {
			type: DataTypes.INTEGER,
			allowNull: false			
        },
        permit_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
	}, {
		tableName: 'tbl_role_permission'
	});

	role_permission.associate = function(models) {
		models.role.hasMany(role_permission, {
			as: 'role_permission',
			foreignKey: 'role_id',
			sourceKey: 'id'
		});

		role_permission.belongsTo(models.role, {
			foreignKey: 'role_id',
			targetKey: 'id'
        });
        
        models.permission.hasMany(role_permission, {
			as: 'role_permission',
			foreignKey: 'permit_id',
			sourceKey: 'id'
		});

		role_permission.belongsTo(models.permission, {
			foreignKey: 'permit_id',
			targetKey: 'id'
		});
	};

	return role_permission;
};