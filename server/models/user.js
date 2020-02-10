const cryptPassword = require('../services/util.service').cryptPassword

module.exports = function(sequelize, DataTypes) {
	const user = sequelize.define('user', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'user_id'
		},
		full_name: {
			type: DataTypes.STRING(100),
			allowNull: false,
			defaultValue: ''
		},
		username: {
			type: DataTypes.STRING(50),
			allowNull: false
        },
        passwd: {
			type: DataTypes.STRING(255),
            allowNull: false
		},
		role_id: {
			type: DataTypes.INTEGER
		},
        user_status: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: 'A'
        }        
	}, {
		tableName: 'tbl_user'
	});

	user.associate = models => {
		models.role.hasMany(user, {
			as: 'user',
			foreignKey: 'role_id',
			sourceKey: 'id'
		});

		user.belongsTo(models.role, {
			foreignKey: 'role_id',
			targetKey: 'id'
        });
	};

	user.beforeCreate(instance => {
		return cryptPassword(instance.passwd)
			.then(hash => {
				instance.passwd = hash;
			})
			.catch(err => {
				console.log(err);
		});
	});

	return user;
};
