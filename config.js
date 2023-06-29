module.exports = {
    apps : [
        {
          name: "myapp",
          script: "app.js",
          node_args:'-r dotenv/config'
        }
    ]
  }