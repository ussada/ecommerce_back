module.exports = function(sequelize, DataTypes) {
	const category = sequelize.define('category', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'cat_id'
		},
		cat_name: {
			type: DataTypes.STRING(50),
			allowNull: false,
			defaultValue: ''
        },
        cat_status: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: 'A'
        }        
	}, {
		tableName: 'tbl_category'
	});

	return category;
};
