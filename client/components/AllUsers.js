import React from "react";
import { fetchUsers } from "../store/allUsers";
import { connect } from "react-redux";

class AllUsers extends React.Component {
  componentDidMount() {
    try {
      this.props.loadUsers();
    } catch (err) {
      console.log(err);
    }
  }
  render() {
    const users = this.props.users || [];
    return (
      <div className="all-users">
        <h3>Users</h3>
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
              <th>Email</th>
            </tr>

            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    users: state.allUsers,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadUsers: () => dispatch(fetchUsers()),
  };
};

export default connect(mapState, mapDispatch)(AllUsers);
