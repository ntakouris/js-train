import {train, resources, ui} from '.';
import http from 'http';

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8080, 'localhost');

console.log('Server running at http://localhost:8080/');