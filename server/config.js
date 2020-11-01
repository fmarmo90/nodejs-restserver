const config = {}

config.port =  process.env.PORT || 3000
config.enviroment = process.env.NODE_ENV || 'dev'
config.DbUrl = (config.enviroment == 'dev') ? 'mongodb://localhost:27017' : process.env.MONGO_DB_URI
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

config.token_expiration_time = 60
config.token_seed = process.env.SEED || 'this-is-the-seed-development'

module.exports = {
    config
}