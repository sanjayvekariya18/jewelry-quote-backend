module.exports = {
    apps : [{
      name   : "catalog",
      script : "./dist/server.js",
      interpreter: './node_modules/.bin/ts-node',
    }]
  }