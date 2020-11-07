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

config.token_expiration_time = 60 * 5
config.token_seed = process.env.SEED || 'this-is-the-seed-development'
config.google_client_id = process.env.GOOGLE_CLIENT_ID || '887507084950-k4re4tm23srffkqi1e0l23bo8bks1n6s.apps.googleusercontent.com'

module.exports = {
    config
}