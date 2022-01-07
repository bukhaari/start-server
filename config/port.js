function port(app) {
  const port = process.env.PORT;
  
  app.listen(port, () =>
    console.log(`Server start on port http://localhost:${port}`)
  );
}

module.exports = port;
