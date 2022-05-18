const Sequelize = require('sequelize');
let dbName = 'fs-app-template';
const db = new Sequelize(`postgres://localhost/${dbName}`, {
  logging: false,
});

//not detecting new model names because it detects from this db object,
//no the underlying postgres db

const path = require('path');
const express = require('express');
const app = express();

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

app.get('/models', async (req, res, next) => {
  try {
    const test = await db.query(
      `SELECT * FROM information_schema.tables WHERE table_schema='public';`
    );
    console.log(test);
    //query db here?
    res.send(
      test
      // Object.keys(db.models)
    );
  } catch (error) {
    next(error);
  }
});

app.get('/generic/:model', async (req, res, next) => {
  try {
    const response = await db.query(`SELECT * FROM ${req.params.model};`);
    console.log('>>>>>', response[0]);
    res.send(response[0]);
  } catch (error) {
    next(error);
  }
});

// if (dbName === 'electron-test') {
//   module.exports = { db, init, User, app };
// } else {
module.exports = { db, init, app };
// }
