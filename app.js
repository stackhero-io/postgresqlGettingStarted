require('dotenv').config();
const { Client } = require('pg');
const faker = require('faker');


(async () => {
  if (!process.env.POSTGRESQL_HOST) {
    console.error('You have to define credentials in the `.env` file (see the `.env-example` file as an example).');
    process.exit(1);
  }


  // Note: credentials have to be defined in the `.env` file (see the `.env-example` file as an example).
  const pg = new Client({
    host: process.env.POSTGRESQL_HOST,
    user: process.env.POSTGRESQL_USERNAME,
    password: process.env.POSTGRESQL_PASSWORD,
    database: 'admin'
  });

  await pg.connect();

  // Create table stackherotest-users if not exists yet
  await pg.query('CREATE TABLE IF NOT EXISTS "stackherotest-users" '
    + '('
    + '"userId" SERIAL,'
    + '"name" VARCHAR(128) NOT NULL,'
    + '"address" TEXT NOT NULL,'
    + '"email" VARCHAR(265) NOT NULL'
    + ')');


  // Insert 100 fake users
  for (let i = 0; i < 100; i++) {
    await pg.query(
      'INSERT INTO "stackherotest-users" ("userId", "name", "address", "email") VALUES ($1, $2, $3, $4)',
      [
        Math.round(Math.random() * 100000), // Generate a fake userId
        faker.name.findName(), // "name"
        faker.address.streetName(), // "address"
        faker.internet.email() // "email"
      ]
    );
  }

  console.log('Users have been added 👍');
  console.log('Connect to your pgadmin and see them in database admin, table stackherotest-users');

  // Count number of rows in table users
  const { rows: usersCountRows } = await pg.query('SELECT COUNT(*) AS cpt FROM "stackherotest-users"');
  console.log(`There is now ${usersCountRows[0].cpt} in table "users"`);

  await pg.end();
})().catch(error => {
  console.error('');
  console.error('🐞 An error occurred!');
  console.error(error);
  process.exit(1);
});