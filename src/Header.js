import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
  getDbName,
  loadDbNames,
  loadModels,
  genericLoader,
  dbSelect,
} from '../store';

function header({ models, dbName, dbList }) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [currentDb, setCurrentDb] = useState(dbName);
  const [selectedTable, setSelectedTable] = useState('');

  console.log(state);

  useEffect(() => {
    console.log('useEffect run');
    dispatch(loadDbNames());
    dispatch(getDbName());
  }, []);

  useEffect(() => {
    dispatch(getDbName());
    dispatch(loadModels());
    state.models.forEach((model) => genericLoader(model));
    setSelectedTable(models[0]);
  }, [currentDb]);

  function handleDbSelect(ev) {
    dispatch(dbSelect(ev.target.value));
    setCurrentDb(ev.target.value);
  }

  function handleTableSelect() {}

  return (
    <div>
      <h1>Postixo</h1>
      {dbName.length ? <h3>current database is: {dbName}</h3> : ''}
      <div className='header'>
        <div className='selector'>
          <div className='label'>
            <label htmlFor='dbSelect'>select database</label>
            {/* <button onClick={this.handleRefresh}>refresh</button> */}
          </div>
          <div>
            <select name='dbSelect' value={dbName} onChange={handleDbSelect}>
              {dbList.length
                ? dbList.map((name, i) => {
                    return <option key={i}>{name}</option>;
                  })
                : ''}
            </select>
          </div>
        </div>
        <div className='selector'>
          <div className='label'>
            <label htmlFor='tableSelect'>select table</label>
            <button style={{ opacity: '0' }}>spacer</button>
          </div>
          <div>
            <select
              id='tableSelect'
              name='tableSelect'
              value={selectedTable}
              onChange={handleTableSelect}
            >
              {models.length ? (
                models.map((model, i) => {
                  return <option key={i}>{model}</option>;
                })
              ) : (
                <option>no tables available</option>
              )}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect((state) => state)(header);
