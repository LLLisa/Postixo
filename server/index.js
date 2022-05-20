const path = require('path');
const express = require('express');
const app = express();
const Sequelize = require('sequelize');
//default db connection is 'template1'
let dbName = '';
if (!dbName.length) dbName = 'dealers_choice_spa';
let db = new Sequelize(`postgres://localhost/${dbName}`, {
  logging: false,
});

app.get('/dbChange/:newDbName', (req, res, next) => {
  console.log('>>>>>>', req.params.newDbName);
  try {
    dbName = req.params.newDbName;
    db.close();
    db = new Sequelize(`postgres://localhost/${dbName}`, {
      logging: false,
    });
  } catch (error) {
    next(error);
  }
  res.sendStatus(200);
});

if (dbName === 'electron-test') {
  const User = db.define('user', {
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
  });

  const Todo = db.define('todo', {
    text: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  Todo.belongsTo(User);
  User.hasMany(Todo);
}

const init = async () => {
  try {
    // if (dbName === 'electron-test') {
    //   await db.sync({ force: true });
    //   const lisa = await User.create({ firstName: 'Lisa', lastName: 'Knox' });
    //   const kitty = await User.create({
    //     firstName: 'Jean-Michel',
    //     lastName: 'Cat',
    //   });
    //   const kiera = await User.create({
    //     firstName: 'Kiera',
    //     lastName: 'Chien',
    //   });
    //   await Todo.create({ text: 'buy cat food', userId: lisa.id });
    //   await Todo.create({ text: 'eat cat food', userId: kitty.id });

    //   console.log('~~~db seeded!~~~');
    // }
    console.log('~~~db connected:', dbName);
    app.listen(42069, () => console.log(`listening on port hadrcoded 42069`));
  } catch (error) {
    console.log(error);
  }
};

init();

//server api-----------------------------------------
app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

//runs twice: once for reducer generator, once for store
app.get('/models', async (req, res, next) => {
  try {
    const tables = await db.query(
      `SELECT * FROM information_schema.tables WHERE table_schema='public';`
    );
    const response = tables[0].map((table) => table.table_name);
    // console.log(response);
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
    // console.log(req.params.model);
    // console.log('>>>>>', response[0][0]);
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
