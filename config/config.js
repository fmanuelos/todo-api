module.exports = {
  "test": {
    'port' : 3000,
    'mongoose': {
      'uri': 'mongodb://localhost/apitest' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
    }
  },
  "development": {
    'port' : 3000,
    'mongoose': {
      'uri': 'mongodb://localhost/apitest'
    }
  },
  "production": {
    'port' : 3000,
    'mongoose': {
      'uri': 'mongodb://localhost/apitest'
    }
  },
  'security': {
    'token_life' : 3600 //segundos 86400 seg un dia
  },
};
