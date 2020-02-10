module.exports = function(sequelize, DataTypes) {
	const product = sequelize.define('product', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'prod_id'
		},
		cat_id: {
			type: DataTypes.INTEGER
        },
        prod_name: {
			type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: ''
		},
		prod_price: {
			type: DataTypes.DECIMAL(10,2),
			allowNull: false,
			defaultValue: 0.00
		},
		prod_qty: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		prod_status: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: 'A'
        }        
	}, {
		tableName: 'tbl_product'
	});

	product.associate = models => {
		models.category.hasMany(product, {
			as: 'product',
			foreignKey: 'cat_id',
			sourceKey: 'id'
		});

		product.belongsTo(models.category, {
			foreignKey: 'cat_id',
			targetKey: 'id'
        });
	};

	return product;
};
