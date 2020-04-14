import 'dotenv/config';

export default {
  PORT: process.env.PORT || 8080,
  HOST: '0.0.0.0',
  DB_CONNECTION_STRING: process.env.CUSTOMCONNSTR_covid_db_conn,
  DATABASE_ID: process.env.DATABASE_ID,
  CONTAINER: process.env.CONTAINER
};
