import React, { Component } from "react";
import axios from "axios";
import TransactionRow from '../TransactionRow/transactionRow';

export default class TableBody extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editingRow: {
        value: false,
        id: ""
      },
      addingTransaction: this.props.addingTransaction
    }
  }

  componentDidUpdate(prevProps) {}

  deleteTransactionsHandler = id => {
    console.log(id);
    axios.delete(`/api/transactions/${id}`)
    .then(res => {
        this.getTransactionsHandler();
    })
    .catch(error => {
        console.log(error);
    });
  };

  putTransactionsHandler = (id, obj) => {
      console.log(id);
      console.log(obj);
    axios.put(`/api/transactions/${id}`, obj)
    .then(res => {
        this.getTransactionsHandler();
    })
    .catch(error => {
        console.log(error);
    });
  };

  getRows = () => {
    let {rows} = this.props;

    return rows.map((row) => (
        <TransactionRow key={row._id} {...row} editRow={this.putTransactionsHandler} deleteRow={this.deleteTransactionsHandler}/>
    ));
  }

  addingTransactionRow = () => {
    return (
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
    )
  }

  render() {
    let {rows} = this.props;
    // if(!rows || rows.length < 1) {
    //   return (
    //     <React.Fragment>
    //       <tr>
    //         <td colSpan="3">no transaction data available</td>
    //       </tr>
    //     </React.Fragment>
    //   )
    // }

    return (
      <tbody>
        {this.getRows()}
        {/*this.state.addingTransaction && this.addingTransactionRow()*/}
      </tbody>
    )
  }
}
