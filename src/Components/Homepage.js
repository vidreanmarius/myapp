import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserBox from './UserBox';
import DeviceBox from './DeviceBox';
import { GET_USERS } from '../Utils/UrlConstants';
import { GET_DEVICES } from '../Utils/UrlConstants';

const Homepage = () => {
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [isError, setIsError] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUsername, setEditedUsername] = useState('');
  const [editedPassword, setEditedPassword] = useState('');
  const [editedRole, setEditedRole] = useState('');

  const userRole = localStorage.getItem('userRole');

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${GET_USERS}/${userId}`);
      console.log('User deleted successfully:', response.data);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const openEditModal = (user) => {
    setShowEditModal(true);
    setSelectedUser(user);
    setEditedUsername(user.username);
    setEditedPassword(user.password);
    setEditedRole(user.role);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put(`${GET_USERS}/${selectedUser.id}`, {
        id: selectedUser.id,
        username: editedUsername,
        password: editedPassword,
        role: editedRole,
      });
      console.log('User edited successfully:', response.data);
      // Add logic to update the UI or data after successful edit
      closeEditModal();
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(GET_USERS);
        setUsers(response.data);
      } catch (error) {
        setIsError(true);
      }
    };

    const fetchDevices = async () => {
      try {
        const response = await axios.get(GET_DEVICES);
        setDevices(response.data);
      } catch (error) {
        setIsError(true);
      }
    };


    fetchUsers();
    fetchDevices();
  }, []);

  return (
    <div className="homepage-container">
      <h2>Welcome to the Homepage</h2>
      {userRole === 'admin' ? (
        <div>
          <h3>You are logged in as an Admin</h3>
        </div>
      ) : (
        <div>
          <h3>You are logged in as a Client</h3>
        </div>
      )}

      {isError ? (
        <div>Error fetching users.</div>
      ) : (
        <div>
          <h4>List of Users:</h4>
          {users.map((user) => (
            <UserBox key={user.id} user={user} onDelete={deleteUser} onEdit={() => openEditModal(user)} />
          ))}
        </div>
      )}

      {showEditModal && (
        <div className="edit-modal">
          <h2>Edit User</h2>
          <input type="text" value={editedUsername} onChange={(e) => setEditedUsername(e.target.value)} />
          <input type="text" value={editedPassword} onChange={(e) => setEditedPassword(e.target.value)} />
          <input type="text" value={editedRole} onChange={(e) => setEditedRole(e.target.value)} />
          <button onClick={handleEdit}>Save Changes</button>
          <button onClick={closeEditModal}>Cancel</button>
        </div>
      )}

        <div>
          <h4>List of Devices:</h4>
          {users.map((user) => (
            <DeviceBox key={devices.id} device={devices} onDelete={deleteUser} onEdit={() => openEditModal(devices)} />
          ))}
        </div>
    </div>
  );
};

export default Homepage;
