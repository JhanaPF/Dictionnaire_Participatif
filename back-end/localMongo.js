// Base de donnée locale

const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'myProject';// Nom de la base de donnée


async function main() {
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('documents');

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
 // .finally(() => client.close());