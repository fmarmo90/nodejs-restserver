const config = {
    port: process.env.PORT || 3000,
    enviroment: process.env.NODE_ENV || 'dev',
    DbUrl: (this.enviroment == 'dev') ? 'mongodb://localhost:27017' : 'mongodb+srv://devko:oY7Y9y9ozs4LWew0@cluster0.4479n.mongodb.net/coffe?retryWrites=true&w=majority'
}

config.DbUrl = (config.enviroment == 'dev') ? 'mongodb://localhost:27017' : 'mongodb+srv://devko:oY7Y9y9ozs4LWew0@cluster0.4479n.mongodb.net/coffe?retryWrites=true&w=majority'
config.DbOptions = (config.enviroment == 'dev') ?   {
                                                        useNewUrlParser: true, 
                                                        useUnifiedTopology: true,
                                                        user: 'root',
                                                        pass: 'example',
                                                        authSource: 'admin',
                                                        dbName: 'coffe'
                                                    } 
                                                : 
                                                    {
                                                        useNewUrlParser: true, 
                                                        useUnifiedTopology: true
                                                    }
module.exports = {
    config
}