import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const InnerGrid = (props) => {
  console.log(props.inherited);
  return (
    <div>
      <table>
        <thead>
          <tr>
            {Object.keys(props.inherited[0]).map((field, i) => {
              return <th key={i}>{field}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {props.inherited.map((row, i) => {
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
    </div>
  );
};

export default connect((state) => state)(InnerGrid);
