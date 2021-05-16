Install and start
1) Set db config in config.js or .env
2) Run command "npm install"
3) Start application with command "npm start"

Generate models for existing database
1) Run command "node generateModel"
2) Revise all models
- Set length for decimal fields
- Discard defaultValue as '' for integer fields
- Remove create/modify date fields (if any) and set in config.js as createdAt, updatedAt property
- See below example model

Parameter
create:
{
  "masterField1": "",
  "masterField2": 1,
  "detail1": [
    {
      "detailField1": 1,
      "detailFields": false
    }
  ],
  "detail2": [
    {
      "detailField2": ""
    }
  ]
}

get:
{
  "attr": [
    "field1",
    "field2"
  ],
  "con": {
    "field1": 1,
    "field2": ""
  },
  "include": {
    "detail1": "detail1",
    {
      "key": "detail2",
      "attr": ["field1", "field2"],
      "con": {
        "field1": "",
	"field2": ""
      },
      include: []
    }
  }
}

update:
{
  "attr": {
    "field1": 1,
    "field2": ""
  },
  "con": {
    "field1": 1,
    "field2": ""
  }
}

delete:
{
  "con": {
    "field1": 1,
    "field2": ""
  }
}

Sample model

master.js:
module.exports = function(sequelize, DataTypes) {
	const detail = sequelize.define('master', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'pk_id'
		}
	}, {
		tableName: 'tbl_master'
	});

	return master;
};

detail.js:
module.exports = function(sequelize, DataTypes) {
	const detail = sequelize.define('detail', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'pk_id'
		},
		fk_id: {
			type: DataTypes.INTEGER,
			allowNull: false			
		}
	}, {
		tableName: 'tbl_detail'
	});

	detail.associate = function(models) {
		models.master.hasMany(detail, {
			as: 'detail',  // match with include association name
			foreignKey: 'fk_id',
			sourceKey: 'id'
		});

		detail.belongsTo(models.master, {
			foreignKey: 'fk_id',
			targetKey: 'id'
		});
	};

	return detail;
};
