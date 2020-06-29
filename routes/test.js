function test(server) {
  server.get('/', (req, res) => {
    res.send(200, 'hello');
  });
}

module.exports = test;
