import React, { Component } from "react";
import axios from "axios";
import Table from '../Table/table';

export default class App extends Component {
  // initialize our state
  state = {
    addingTransaction: false,
    data: [],
    id: false,
    categories: [],
    sortedBy: '',
    message: null,
    transaction: {
        message: "",
        date: "",
        category: "",
        amount: ""
    }
  };

  componentDidMount() {
    this.getTransactionsHandler();
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  getTransactionsHandler = () => {
    fetch("/api/transactions")
      .then(transactions => transactions.json())
      .then(res => {
          this.setState({data: res});
      })
      .catch(error => {
          console.log(error);
      });
  };

  postTransactionsHandler = obj => {
    axios.post(`/api/transactions`, obj)
    .then(res => {
        this.resetTransactionState();
        this.getTransactionsHandler();
    })
    .catch(error => {
        console.log(error);
    });
  };

  deleteTransactionsHandler = id => {
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

  onChangeHandler = (e) => {
    this.setState({
        transaction: {
            ...this.state.transaction,
            [e.target.name]: e.target.value
        }
    });
  }

  resetTransactionState = () => {
      this.setState({
          transaction: {
              message: "",
              date: "",
              category: "",
              amount: ""
          }
      });
  }

  setTransactionState = () => {
      this.setState((state) => ({
          addingTransaction: !this.state.addingTransaction
      }), ()=>{console.log(this.state);});


  }

  sorting = (transactions, column) => {
      if(this.state.sortedBy !== column){
          let sortedArray;

          switch(column){
              case 'date':
                sortedArray = transactions.sort((a,b) => {
                  return new Date(a[column]) - new Date(b[column]);
                });
                break;
              case 'amount':
                sortedArray = transactions.sort((a,b) => {
                  return a[column] - b[column];
                });
                break;
              default:
                sortedArray = transactions.sort((a,b) => {
                  if(a[column] > b[column]) return 1;
                  if(a[column] < b[column]) return -1;
                  return 0;
                });
          }

          this.setState({
              sortedBy: column,
              data: sortedArray
          });
      }

      this.setState({ data: transactions.reverse() });
  }

  render() {
    const {addingTransaction, data, transaction} = this.state;

    return (
        <div className="container">
            <div className="ui attached stackable menu">
                <div className="ui container">
                    <a className="item">
                    <i className="home icon"></i> Home
                    </a>
                    <a className="item">
                    <i className="grid layout icon"></i> Browse
                    </a>
                    <a className="item">
                    <i className="mail icon"></i> Messages
                    </a>
                    <div className="ui simple dropdown item">
                        More
                        <i className="dropdown icon"></i>
                        <div className="menu">
                        <a className="item"><i className="edit icon"></i> Edit Profile</a>
                        <a className="item"><i className="globe icon"></i> Choose Language</a>
                        <a className="item"><i className="settings icon"></i> Account Settings</a>
                        </div>
                    </div>
                    <div className="right item">
                        <div className="ui input"><input type="text" placeholder="Search..."/></div>
                    </div>
                </div>
            </div>
      <table className="ui compact celled striped table">
        <thead>
          <tr>
            <th onClick={() => this.sorting(this.state.data, 'date')}>
                Date <i className="sort icon"></i>
            </th>
            <th>Message</th>
            <th onClick={() => this.sorting(this.state.data, 'category')}>
                Category <i className="sort icon"></i>
            </th>
            <th colSpan="2" onClick={() => this.sorting(this.state.data, 'amount')}>
                Amount <i className="sort icon"></i>
            </th>
          </tr>
        </thead>
        <tbody>
            <Table
                rows={data}
                deleteHandler={this.deleteTransactionsHandler}
                editHandler={this.putTransactionsHandler}
            >
                <tr>
                    <td>
                    <div className="ui input">
                    <input
                      type="date"
                      name="date"
                      value={this.state.transaction.date}
                      onChange={this.onChangeHandler}
                      placeholder="add date"
                    />
                    </div>
                    </td>
                    <td>
                    <div className="ui input">
                    <input
                      type="text"
                      name="message"
                      value={this.state.transaction.message}
                      onChange={this.onChangeHandler}
                      placeholder="add message"
                    />
                    </div>
                    </td>
                    <td>
                    <div className="ui input">
                    <input
                      type="text"
                      name="category"
                      value={this.state.transaction.category}
                      onChange={this.onChangeHandler}
                      placeholder="add category"
                    />
                    </div>
                    </td>
                    <td>
                    <div className="ui input">
                    <input
                      type="text"
                      name="amount"
                      value={this.state.transaction.amount}
                      onChange={this.onChangeHandler}
                      placeholder="add amount"
                    />
                    </div>
                    </td>
                    <td>
                    <button className="ui icon small basic button" onClick={() => this.postTransactionsHandler(transaction)}>
                      <i className="plus icon"></i> Add Transaction
                    </button>
                    </td>
                </tr>
            </Table>
        </tbody>
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
      </table>
        <table>
            <FooHeader/>
            <FooBody/>
            <FooFooter/>
        </table>
      </div>
    );
  }
}
