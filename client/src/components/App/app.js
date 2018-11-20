import React, { Component } from "react";
import axios from "axios";
import TableBody from '../TableBody/tableBody';
import TableFooter from '../TableFooter/tableFooter';
import TransactionRow from '../TransactionRow/transactionRow';
import {Button, Divider, Dropdown, Icon, Image, Dimmer, Loader, Placeholder, Segment} from 'semantic-ui-react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import styles from "./styles.css";

export default class App extends Component {
  // initialize our state
  state = {
    addingTransaction: false,
    categories: [],
    data: [],
    editingRow: null,
    filter: '',
    isLoading: true,
    sortedBy: '',
    transaction: {
        message: "",
        date: "",
        category: "",
        amount: ""
    },
  };

  componentDidMount() {
    this.getTransactionsHandler();
    this.getCategoriesHandler();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('updating with:');
    console.log(prevState);
    console.log(this.state);
  }

  componentWillUnmount() {}

  getTransactionsHandler = () => {
    fetch("/api/transactions")
      .then(transactions => transactions.json())
      .then(res => {
        this.setState({
          data: res,
          isLoading: false
        });
      })
      .catch(error => {
          console.log(error);
      });
  };

  postTransactionsHandler = obj => {
    axios.post(`/api/transactions`, obj)
    .then(res => {
        this.setState({
          addingTransaction: false,
          transaction: {
              message: "",
              date: "",
              category: "",
              amount: ""
          }
        });
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

  putTransactionsHandler = (obj, id) => {
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

  getCategoriesHandler = () => {
    fetch("/api/categories")
      .then(categories => categories.json())
      .then(res => {
          this.setState({categories: res});
          console.log(res);
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

  setTransactionState = () => {
    this.setState((state) => ({
        addingTransaction: !this.state.addingTransaction
    }), ()=>{console.log(this.state);});
  }

  editRowHandler = (id) => {
    this.setState({
      editingRow: id,
    });
  }

  saveRowHandler = (obj, id, callback) => {
    console.log('saving row');
    console.log(obj);
    console.log(id);
    console.log(callback);

    if(id){
      console.log('id');
    }
    this.setState({
      editingRow: null,
    });
    //call put API
    //this.putTransactionsHandler(obj, id);
    callback(obj, id);
  }

  // addRowHandler = (obj) => {
  //   this.setState({
  //     editingRow: null,
  //   });
  //
  //   this.postTransactionsHandler(obj);
  // }

  deleteRowHandler = (id) => {
    console.log('deleting row');

    this.deleteTransactionsHandler(id);
  }

  cancelEditRowHandler = () => {
    console.log('cancel edits');
    this.setState({
      editingRow: null
    });
  }

  cancelAddTransactionHandler = () => {
    this.setTransactionState();
  }

  addTransactionHandler = () => {
    this.setTransactionState();
  }

  filterTransactionsHandler = (e, obj) => {
    console.log(e);
    console.log(obj.value);
    fetch(`/api/transactions?category=${obj.value}`)
    .then(transactions => transactions.json())
    .then(res => {
        this.setState({data: res});
    })
    .catch(error => {
        console.log(error);
    });
  }

  get categories() {
      let {categories} = this.props;

      return categories.map(cat => {
        return <option key={cat._id} value={cat.value}>{cat.text}</option>
      })
  }

  getRows = () => {
    let {data} = this.state;

    return data.map((row) => {
      let editingRow = this.state.editingRow === row._id ? true : false;
      let disablingRow = (this.state.editingRow !== null && !editingRow) ? true : false;

      return (
        <TransactionRow
          isLoading={this.state.isLoading}
          key={row._id}
          cancelRow={this.cancelEditRowHandler}
          categories={this.state.categories}
          deleteRow={this.deleteRowHandler}
          disabled={disablingRow}
          editing={editingRow}
          editRow={this.editRowHandler}
          saveRow={this.saveRowHandler}
          saveRowCallback={this.putTransactionsHandler}
          transaction={row}
          isLargeLayout={this.state.isLargeLayout}
        />
      )
    });
  }

  render() {
    const {addingTransaction, data, transaction, isLargeLayout} = this.state;

    return (
      <div className="ui container">
      {/*
        <table className="ui table unstackable">
          <thead>
            <tr>
              <th className="date" onClick={() => this.sorting(this.state.data, 'date')}>
                  Date <i className="sort icon"></i>
              </th>
              <th className="message">Message</th>
              <th className="category" onClick={() => this.sorting(this.state.data, 'category')}>
                  Category <i className="sort icon"></i>
              </th>
              <th className="amount" onClick={() => this.sorting(this.state.data, 'amount')}>
                  Amount <i className="sort icon"></i>
              </th>
              <th className="controls">
                <Button basic animated fluid onClick={this.addTransactionHandler} disabled={addingTransaction}>
                  <Button.Content visible>Add</Button.Content>
                  <Button.Content hidden>
                    Transaction
                  </Button.Content>
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.getRows()}
            {addingTransaction && (
              <TransactionRow
                cancelRow={this.cancelAddTransactionHandler}
                categories={this.state.categories}
                deleteRow={this.deleteRowHandler}
                disabled={false}
                editing={true}
                editRow={this.editRowHandler}
                saveRow={this.saveRowHandler}
                saveRowCallback={this.postTransactionsHandler}
              />
            )}
          </tbody>
          <tfoot className="full-width">
            <tr>
              <th colSpan="5">
                <div className="ui input">
                  <span>Show results for:</span>
                  <Dropdown
                    multiple selection clearable
                    placeholder='add category filter'
                    value={this.state.filters}
                    name="filters"
                    onChange={this.filterTransactionsHandler}
                    options={this.state.categories}
                  />
                </div>
              </th>
            </tr>
          </tfoot>
        </table>
      */}

        <div className="table">
          <Segment className="header" basic>
            <Segment.Group className="row" horizontal>
              <Segment className="cell date" onClick={() => this.sorting(this.state.data, 'date')}>
                  Date <i className="sort icon"></i>
              </Segment>
              <Segment className="cell message">Message</Segment>
              <Segment className="cell category" onClick={() => this.sorting(this.state.data, 'category')}>
                  Category <i className="sort icon"></i>
              </Segment>
              <Segment className="cell amount" onClick={() => this.sorting(this.state.data, 'amount')}>
                  Amount <i className="sort icon"></i>
              </Segment>
              <Segment className="cell controls">
                <Button basic animated fluid onClick={this.addTransactionHandler} disabled={addingTransaction}>
                  <Button.Content visible>Add</Button.Content>
                  <Button.Content hidden>
                    Transaction
                  </Button.Content>
                </Button>
              </Segment>
            </Segment.Group>
          </Segment>
          <Segment className="body" basic>
            <ReactCSSTransitionGroup
              transitionName="example"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}
            >
              {this.getRows()}
            </ReactCSSTransitionGroup>
          </Segment>
          <Segment className="footer" basic>
            <div className="table-row">
              <div className="table-cell">
                Show results for:
              </div>
              <div className="table-cell">
                <div className="ui input">
                  <Dropdown
                    multiple selection clearable
                    placeholder='add category filter'
                    value={this.state.filters}
                    name="filters"
                    onChange={this.filterTransactionsHandler}
                    options={this.state.categories}
                  />
                </div>
              </div>
            </div>
          </Segment>
        </div>
        {/*
        <div>
          <Segment.Group horizontal>
            <Segment className="table-cell date" onClick={() => this.sorting(this.state.data, 'date')}>
                Date <i className="sort icon"></i>
            </Segment>
            <Segment className="table-cell message">Message</Segment>
            <Segment className="table-cell category" onClick={() => this.sorting(this.state.data, 'category')}>
                Category <i className="sort icon"></i>
            </Segment>
            <Segment className="table-cell amount" onClick={() => this.sorting(this.state.data, 'amount')}>
                Amount <i className="sort icon"></i>
            </Segment>
            <Segment className="table-cell controls">
              <Button basic animated fluid onClick={this.addTransactionHandler} disabled={addingTransaction}>
                <Button.Content visible>Add</Button.Content>
                <Button.Content hidden>
                  Transaction
                </Button.Content>
              </Button>
            </Segment>
          </Segment.Group>
          <main loading={this.state.isLoading}>
            <ReactCSSTransitionGroup
              transitionName="example"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}
            >
              {this.getRows()}
            </ReactCSSTransitionGroup>
            {addingTransaction && (
              <TransactionRow
                cancelRow={this.cancelAddTransactionHandler}
                categories={this.state.categories}
                deleteRow={this.deleteRowHandler}
                disabled={false}
                editing={true}
                editRow={this.editRowHandler}
                saveRow={this.saveRowHandler}
                saveRowCallback={this.postTransactionsHandler}
              />
            )}
          </main>
          <footer>
            <div className="table-row">
              <div className="table-cell">
                Show results for:
              </div>
              <div className="table-cell">
                <div className="ui input">
                  <Dropdown
                    multiple selection clearable
                    placeholder='add category filter'
                    value={this.state.filters}
                    name="filters"
                    onChange={this.filterTransactionsHandler}
                    options={this.state.categories}
                  />
                </div>
              </div>
            </div>
          </footer>
        </div>
        */}
      </div>
    );
  }
}
