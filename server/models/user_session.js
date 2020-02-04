module.exports = function(sequelize, DataTypes) {
	const user_session = sequelize.define('user_session', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'ss_id'
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
        },
        refresh_token: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        expires_in: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ''
        }
	}, {
		tableName: 'tbl_user_session'
    });
    
    user_session.associate = models => {
		models.user.hasOne(user_session, {
			as: 'user_session',
			foreignKey: 'user_id',
			sourceKey: 'id'
		});
    };
    
    return user_session;
};
