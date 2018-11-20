import React, { Component } from "react";
import axios from "axios";
import TableBody from '../TableBody/tableBody';

export default class TableFooter extends Component {
  // initialize our state
  state = {
    addingTransaction: this.props.addingTransaction,
  };

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {
    console.log('updating with:');
    console.log(prevProps);
    console.log(prevState);
  }

  componentWillUnmount() {}

  render() {
    const {data, transaction} = this.state;

    return (
      <tfoot className="full-width">
        {this.state.addingTransaction && (
          <tr>
            <th>
                <div className="ui input">
                    <input
                      type="date"
                      name="date"
                      value={this.state.transaction.date}
                      onChange={this.onChangeHandler}
                      placeholder="add date"
                    />
                </div>
            </th>
            <th>
                <div className="ui input">
                    <input
                      type="text"
                      name="message"
                      value={this.state.transaction.message}
                      onChange={this.onChangeHandler}
                      placeholder="add message"
                    />
                </div>
            </th>
            <th>
                <div className="ui input">
                    <input
                      type="text"
                      name="category"
                      value={this.state.transaction.category}
                      onChange={this.onChangeHandler}
                      placeholder="add category"
                    />
                </div>
            </th>
            <th>
                <div className="ui input">
                    <input
                      type="text"
                      name="amount"
                      value={this.state.transaction.amount}
                      onChange={this.onChangeHandler}
                      placeholder="add amount"
                    />
                </div>
            </th>
            <th>
                <button className="ui icon small basic button" onClick={this.setTransactionState}>
                  <i className="minus icon"></i> Transaction
                </button>
            </th>
          </tr>
        )}
        {!this.state.addingTransaction && (
            <tr>
            <th colSpan="4"></th>
            <th>
                <button className="ui icon small basic button" onClick={this.setTransactionState}>
                  <i className="plus icon"></i> Transaction
                </button>
            </th>
            </tr>
        )}
      </tfoot>
    );
  }
}
