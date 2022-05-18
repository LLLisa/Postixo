import React from 'react';
import { connect } from 'react-redux';
import { loadModels, genericLoader } from '../store';
import inflection from 'inflection';

class Grid extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedTable: '',
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.tableSubmit = this.tableSubmit.bind(this);
  }

  async componentDidMount() {
    console.log('CDM', this.props);
    const { loadModels, genericLoader } = this.props;
    await loadModels();
    await Promise.all(
      this.props.models.map((model) =>
        genericLoader(inflection.pluralize(model))
      )
    );
    this.setState({
      selectedTable: inflection.pluralize(this.props.models[0]),
    });
  }

  handleOnChange(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  tableSubmit(ev) {
    ev.preventDefault();
    this.setState({ selectedTable: ev.target.value });
  }

  render() {
    // console.log('render', this.props, this.state);
    const { selectedTable } = this.state;
    const { models } = this.props;
    return (
      <div>
        {selectedTable.length && Object.hasOwn(this.props, [selectedTable]) ? (
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
                    {Object.values(row).map((field, i) => {
                      return <td key={i}>{field}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>table not found</p>
        )}
        <select
          name="tableSelect"
          value={selectedTable}
          onChange={this.tableSubmit}
        >
          {models.length
            ? models.map((model, i) => {
                return <option key={i}>{inflection.pluralize(model)}</option>;
              })
            : ''}
        </select>
      </div>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    loadModels: () => dispatch(loadModels()),
    genericLoader: (slice) => dispatch(genericLoader(slice)),
  };
};

export default connect((state) => state, mapDispatch)(Grid);
