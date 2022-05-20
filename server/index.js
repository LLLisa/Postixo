const path = require('path');
const express = require('express');
const app = express();
const Sequelize = require('sequelize');
let db = new Sequelize(`postgres://localhost/template1`, {
  logging: false,
});

const init = async () => {
  try {
    console.log('~~~db connected~~~');
    app.listen(42069, () => console.log(`listening on port hadrcoded 42069`));
  } catch (error) {
    console.log(error);
  }
};

// init();

//server api-----------------------------------------
app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/dbName', async (req, res, next) => {
  try {
    const db_name = await db.query(
      'SELECT table_catalog FROM information_schema.tables LIMIT 1;'
    );
    const currentDb = db_name[0][0].table_catalog;
    res.send(currentDb);
  } catch (error) {
    next(error);
  }
});

app.get('/dbList', async (req, res, next) => {
  try {
    const rawlist = await db.query('SELECT datname FROM pg_database;');
    const db_list = rawlist[0].map((dbase) => dbase.datname);
    res.send(db_list);
  } catch (error) {
    next(error);
  }
});

app.get('/dbChange/:newDbName', (req, res, next) => {
  try {
    db.close();
    db = new Sequelize(`postgres://localhost/${req.params.newDbName}`, {
      logging: false,
    });
    //no response because forced F5
  } catch (error) {
    next(error);
  }
  res.sendStatus(200);
});

//runs twice: once for reducer generator, once for store
app.get('/models', async (req, res, next) => {
  try {
    const tables = await db.query(
      `SELECT * FROM information_schema.tables WHERE table_schema='public';`
    );
    const response = tables[0].map((table) => table.table_name);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

app.get('/generic/:model', async (req, res, next) => {
  try {
    let searchParam = req.params.model;
    const regExp = /[A-Z]/;
    if (regExp.test(searchParam)) searchParam = `"${searchParam}"`;
    const response = await db.query(`SELECT * FROM ${searchParam};`);
    if (response) {
      res.send(response[0]);
    } else {
      res.send([]);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = { db, init, app };
