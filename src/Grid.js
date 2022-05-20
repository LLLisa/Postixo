import React from 'react';
import { connect } from 'react-redux';
import { loadModels, genericLoader, dbSwitcheroo } from '../store';
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
    await loadModels();
    await Promise.all(this.props.models.map((model) => genericLoader(model)));
    this.setState({
      selectedTable: this.props.models[0],
    });
  }

  handleOnChange(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  tableSubmit(ev) {
    // ev.preventDefault();
    this.setState({ selectedTable: ev.target.value });
  }

  async dbSelect(ev) {
    ev.preventDefault();
    // await dbSwitcheroo(this.state.dbName);
    const response = await axios({
      url: `/dbChange/${this.state.dbName}`,
      baseURL: 'http://localhost:42069',
    });
    window.location.reload();

    // this.setState({ dbName: '' });
  }

  render() {
    // console.log('render', this.props, this.state);
    const { selectedTable } = this.state;
    const { models } = this.props;
    return (
      <div>
        <form>
          <input
            name="dbName"
            value={this.state.dbName}
            placeholder="database name"
            onChange={this.handleOnChange}
          ></input>
          <button onClick={(ev) => this.dbSelect(ev)}>submit</button>
        </form>
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
                  <tr key={i}>
                    {Object.values(row).map((value, j) => {
                      return value && Array.isArray(value) ? (
                        <td key={j}>
                          <InnerGrid inherited={value} />
                        </td>
                      ) : typeof value === 'object' ? (
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
    loadModels: () => dispatch(loadModels()),
    genericLoader: (slice) => dispatch(genericLoader(slice)),
    // dbSwitcheroo: (newDbName) => dispatch(dbSwitcheroo(newDbName)),
  };
};

export default connect((state) => state, mapDispatch)(Grid);
