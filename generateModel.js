const generateModel = () => {
    return new Promise((resolve, reject) => {
        const env = process.env.NODE_ENV || 'development';
        const config = require('./config/config.js')[env];
        const SequelizeAuto = require('sequelize-auto');

        const auto = new SequelizeAuto(config.database, config.username, config.password, {
            host: 'localhost',
            dialect: 'mysql',
            directory: './server/models', // prevents the program from writing to disk
            port: config.port
        });

        auto.run((err) => {
            if (err) throw reject(err);
        
            // console.log(auto.tables); // table list
            // console.log(auto.foreignKeys); // foreign key list
            resolve('Generate complete!!');
        }); 
    });  
}

const renameModel = () => {
    return new Promise((resolve, reject) => {
        const modelFolder = './server/models/';
        const fs = require('fs');

        fs.readdir(modelFolder, (err, files) => {
            if (err) {
                reject(err);
                return;
            }

            files.forEach(file => {
                fs.rename(modelFolder+file, modelFolder+file.replace('tbl_', ''), (err) => {
                    if (err) console.log(err);                
                }); 
            });
            
            resolve('Rename complete!!');
        });        
    });
}

generateModel().then((resolve, reject) => {
    if (reject) console.log(reject)
    else console.log(resolve);
    return renameModel().then((resolve, reject) => {
        if (reject) console.log(reject) 
        else console.log(resolve);
    });
});