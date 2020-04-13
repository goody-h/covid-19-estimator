import { CosmosClient } from '@azure/cosmos';
import express from './app';
import DBHelper from './database/db-helper';
import config from './config';


const port = config.PORT;
const connString = config.DB_CONNECTION_STRING;
const database = config.DATABASE_ID;
const container = config.CONTAINER;

const client = new CosmosClient(connString);

const dbHelper = new DBHelper(client, database, container);

try {
  dbHelper.init((err) => {
    console.error(err);
  });
} catch (err) {
  console.error(err);
  console.error(
    'Shutting down because there was an error settinig up the database.'
  );
  process.exit(1);
}

const app = express({
  setlog: (log) => dbHelper.addItem(log),
  getlogs: () => dbHelper.getAllItems()
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
