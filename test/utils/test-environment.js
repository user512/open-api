const jwt = require('jsonwebtoken');
const NodeEnvironment = require('jest-environment-node');

// can be found in ~/src/auth/index.js
// not 'required' due to jest no knowing how to read es6 modules
const namespace = 'https://auth-ns.freecodecamp.org/';

const { JWT_CERT } = process.env;

class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    this.global.__MONGO_URI__ = await global.__MONGOD__.getConnectionString();
    this.global.__MONGO_DB_NAME__ = global.__MONGO_DB_NAME__;

    const token = jwt.sign(
      {
        name: 'Charlie',
        email: 'charlie@thebear.me',
        [namespace + 'accountLinkId']: '76b27a04-f537-4f7d-89a9-b469bf81208b'
      },
      JWT_CERT
    );
    const token2 = jwt.sign(
      {
        name: 'Lola',
        email: 'lola@cbbc.tv',
        [namespace + 'accountLinkId']: '85a937d5-c82c-4aa9-8e0b-9f2b9a7cc36c'
      },
      JWT_CERT
    );
    const headers = {
      'Content-Type': 'application/json'
    };

    this.global.mockedContextWithOutToken = { headers: headers };

    const headersWithValidTokenForCharlie = {
      ...headers,
      Authorization: 'Bearer ' + token
    };
    this.global.mockedContextWithValidTokenForCharlie = {
      headers: headersWithValidTokenForCharlie
    };

    const headersWithValidTokenForLola = {
      ...headers,
      authorization: 'Bearer ' + token2
    };
    this.global.mockedContextWithValidTokenForLola = {
      headers: headersWithValidTokenForLola
    };

    const headersWithInValidToken = {
      ...headers,
      Authorization: 'Bearer 123'
    };
    this.global.mockedContextWithInValidToken = {
      headers: headersWithInValidToken
    };

    await super.setup();
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = MongoEnvironment;
