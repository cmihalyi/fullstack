import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from 'moment';
import { Button, Dropdown, Icon, Segment} from 'semantic-ui-react';
import styles from "./styles.css";

export default class TransactionRow extends Component {

  static propTypes = {
    cancelRow: PropTypes.func,
    categories: PropTypes.array,
    deleteRow: PropTypes.func,
    disabled: PropTypes.bool,
    editing: PropTypes.bool,
    editRow: PropTypes.func,
    saveRow: PropTypes.func,
    saveRowCallback: PropTypes.func,
    transaction: PropTypes.shape({
      message: PropTypes.string,
      date: PropTypes.string,
      category: PropTypes.string,
      amount: PropTypes.string
    })
  }

  static defaultProps = {
    transaction: {
      message: "",
      date: "",
      category: "",
      amount: ""
    }
  }

  constructor(props) {
      super(props);

      this.state = {
        transaction: {
          message: this.props.transaction.message,
          date: this.props.transaction.date,
          category: this.props.transaction.category,
          amount: this.props.transaction.amount
        }
      }

      this.editStateHandler = this.editStateHandler.bind(this);
  }

  componentDidUpdate(prevProps) {
    console.log('updating Row');

    if((this.props.editing !== prevProps.editing) && this.props.editing === true) {
      console.log(`updating row ${this.props.transaction.amount} to be editable.`);
    }
  }

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

  editStateHandler() {
      this.setState((state) => {
          return {isEditable: !state.isEditable}
      })
  };

  onInputChangeHandler = (e) => {
    console.log(e.target.name);
    console.log(e.target.value);
    console.log(this.state);
    this.setState({
        transaction: {
            ...this.state.transaction,
            [e.target.name]: e.target.value
        }
    }, () => {
        console.log(this.state.transaction);
    });
  }

  onDropdownChangeHandler = (e, obj) => {
    console.log(obj);
    this.setState({
        transaction: {
            ...this.state.transaction,
            [obj.name]: obj.value
        }
    }, () => {
        console.log(this.state.transaction);
    });
  }

  get categories() {
      let {categories} = this.props;

      return categories.map(cat => {
          return <option key={cat._id} value={cat.value}>{cat.text}</option>
      })
  }

  render() {
    let {cancelRow, categories, deleteRow, disabled, editing, editRow, isLoading, saveRow, saveRowCallback, transaction} = this.props;

    return (
        <Segment.Group className="row transaction" horizontal>
          <Segment className="cell date" basic>
            {editing &&
              <div className="ui fluid input">
                <input
                    type="date"
                    name="date"
                    value={moment(this.state.transaction.date).utc().format('YYYY-MM-DD')}
                    onChange={this.onInputChangeHandler}
                />
              </div>
            }
            {!editing && moment(transaction.date).utc().format('MM/DD/YYYY')}
          </Segment>
          <Segment className="cell message" basic>
            {editing &&
              <div className="ui fluid input">
                <input
                  type="text"
                  name="message"
                  value={this.state.transaction.message}
                  onChange={this.onInputChangeHandler}
                />
              </div>
            }
            {!editing && <p>{transaction.message}</p>}
          </Segment>
          <Segment className="cell category" basic>
            {editing &&
              <div className="ui fluid input">
                <Dropdown
                  onChange={this.onDropdownChangeHandler}
                  options={this.props.categories}
                  value={this.state.transaction.category}
                  name="category"
                  selection
                  search
                  fluid
                />
              </div>
            }
            {!editing && transaction.category}
          </Segment>
          <Segment className="cell amount" basic>
            {editing &&
              <div className="ui fluid input">
                <input
                  type="text"
                  name="amount"
                  value={this.state.transaction.amount}
                  onChange={this.onInputChangeHandler}
                />
              </div>
            }
            {!editing && transaction.amount}
          </Segment>
          <Segment className="cell controls" basic>
            {editing &&
              <Button.Group fluid>
                <Button compact color="grey" onClick={e => cancelRow()}>
                  <Button.Content>
                    <Icon name="close" />
                  </Button.Content>
                </Button>
                <Button compact color="green" onClick={e => saveRow(this.state.transaction, transaction._id, saveRowCallback)}>
                  <Button.Content>
                    <Icon name="save" />
                  </Button.Content>
                </Button>
              </Button.Group>
            }
            {!editing &&
              <Button.Group fluid>
                <Button compact color="grey" onClick={e => editRow(transaction._id)} disabled={disabled}>
                  <Button.Content>
                    <Icon name="pencil" />
                  </Button.Content>
                </Button>
                <Button compact color="red" onClick={e => deleteRow(transaction._id)} disabled={disabled}>
                  <Button.Content>
                    <Icon name="trash" />
                  </Button.Content>
                </Button>
              </Button.Group>
            }
          </Segment>
        </Segment.Group>
    )
  }
}
