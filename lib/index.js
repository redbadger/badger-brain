import http from 'http';
import fs from 'fs';

const badger = fs.readFileSync(__dirname + '/../assets/badger.txt', 'utf-8');

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
console.log(badger);
