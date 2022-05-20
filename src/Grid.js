import React from 'react';
import { connect } from 'react-redux';
import { getDbName, loadDbNames, loadModels, genericLoader } from '../store';
import InnerGrid from './InnerGrid';
import axios from 'axios';

class Grid extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedTable: '',
      dbName: '',
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.tableSubmit = this.tableSubmit.bind(this);
    this.dbSelect = this.dbSelect.bind(this);
  }

  async componentDidMount() {
    console.log('CDM', this.props);
    const { loadModels, genericLoader } = this.props;
    await loadDbNames();
    await loadModels();
    await Promise.all(this.props.models.map((model) => genericLoader(model)));
    getDbName();

    this.setState({
      dbName: this.props.dbName,
      selectedTable: this.props.models[0],
    });
  }

  handleOnChange(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  tableSubmit(ev) {
    this.setState({ selectedTable: ev.target.value });
  }

  async dbSelect(ev) {
    ev.preventDefault();
    await this.setState({ dbName: ev.target.value });
    const response = await axios({
      url: `/dbChange/${this.state.dbName}`,
      baseURL: 'http://localhost:42069',
    });
    window.location.reload();
  }

  render() {
    const { selectedTable } = this.state;
    const { models, dbName, dbList } = this.props;
    return (
      <div>
        <div>
          <h1>Postixo</h1>
          {dbName.length ? <h3>current database is: {dbName}</h3> : ''}
          {/* <form>
            <input
              name="dbName"
              value={this.state.dbName}
              placeholder="database name"
              onChange={this.handleOnChange}
            ></input>
            <button onClick={(ev) => this.dbSelect(ev)}>submit</button>
          </form> */}
          <select
            name="dbSelect"
            value={this.state.dbName}
            onChange={this.dbSelect}
          >
            {dbList.length
              ? dbList.map((name, i) => {
                  return <option key={i}>{name}</option>;
                })
              : ''}
          </select>
          <select
            name="tableSelect"
            value={selectedTable}
            onChange={this.tableSubmit}
          >
            {models.length
              ? models.map((model, i) => {
                  return <option key={i}>{model}</option>;
                })
              : ''}
          </select>
        </div>
        {models.length &&
        selectedTable.length &&
        this.props[selectedTable].length ? (
          <table>
            <thead>
              <tr>
                {Object.keys(this.props[selectedTable][0]).map((field, i) => {
                  return <th key={i}>{field}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {this.props[selectedTable].map((row, i) => {
                return (
                  <tr className={i % 2 ? '' : 'grayed'} key={i}>
                    {Object.values(row).map((value, j) => {
                      return value && Array.isArray(value) ? (
                        <td key={j}>
                          <InnerGrid inherited={value} />
                        </td>
                      ) : value && typeof value === 'object' ? (
                        <td key={j}>cannot display objects :(</td>
                      ) : (
                        <td key={j}>{value}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>no data to display</p>
        )}
      </div>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    getDbName: dispatch(getDbName()), //whyyyyyyyyyyy
    loadDbNames: dispatch(loadDbNames()),
    loadModels: () => dispatch(loadModels()),
    genericLoader: (slice) => dispatch(genericLoader(slice)),
  };
};

export default connect((state) => state, mapDispatch)(Grid);
