import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserBox from './UserBox';
import DeviceBox from './DeviceBox';
import { ADD_DEVICE, GET_USERS, REGISTER_URL } from '../Utils/UrlConstants';
import { GET_DEVICES, GET_USER_DEVICES } from '../Utils/UrlConstants';

const Homepage = () => {
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [userDevices, setUserDevices] = useState([]);
  const [isError, setIsError] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditModalDevice, setShowEditModalDevice] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [editedUsername, setEditedUsername] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedPassword, setEditedPassword] = useState('');
  const [editedAddress, setEditedAddress] = useState('');
  const [editedRole, setEditedRole] = useState('');
  const [editedMaximumHourlyEnergyConsumption, setEditedMaximumHourlyEnergyConsumption] = useState('');
  const [editedUserId, setEditedUserId] = useState('');

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('');

  const [newDescription, setNewDescription] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newMaximumHourlyEnergyConsumption, setNewMaximumHourlyEnergyConsumption] = useState('');
  const [newUserId, setNewUserId] = useState('');

  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

const defaultRecipientId = '2a93a5c9-0f32-4c41-690e-08dbd8a95a34';
const adminRecipientId = 'a30f1dbf-bd3d-4747-f010-08dc173c6e67';

//for is typing
const [isTyping, setIsTyping] = useState(false);
const [typingTimeoutId, setTypingTimeoutId] = useState(null);

//for last sender
const [lastSenderId, setLastSenderId] = useState(null); 




  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [messageText, setMessageText] = useState('');
  
  useEffect(() => {
    const newWs = new WebSocket('wss://localhost:52176/ws/chat');

    newWs.onopen = () => {
      const userId = localStorage.getItem('userId');
      newWs.send(userId);
    };

    newWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.typing && data.senderId !== userId) {
          setIsTyping(true);
    
          
          if (typingTimeoutId) {
            clearTimeout(typingTimeoutId);
          }
    
        
          const timeoutId = setTimeout(() => {
            setIsTyping(false);
          }, 2000); 
    
          setTypingTimeoutId(timeoutId);
        } 
        if (data.message) { 
          setMessages(prev => [...prev, { text: data.message, sender: data.senderId === userId ? 'self' : 'other' }]);
          setIsTyping(false);
          if (userRole === 'admin' && data.senderId) {
            setLastSenderId(data.senderId); 
          }
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
  
    newWs.onclose = () => {
      console.log("WebSocket connection closed");
    };
  
    setWs(newWs);
  
    return () => {
      newWs.close();
    };
  }, [userId, userRole]); 
  
  const handleTyping = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const typingMessage = JSON.stringify({ typing: true, senderId: userId });
      ws.send(typingMessage);
  
      
      if (typingTimeoutId) {
        clearTimeout(typingTimeoutId);
      }
  
     
      const timeoutId = setTimeout(() => {
        setIsTyping(false);
      }, 2000); 
  
      setTypingTimeoutId(timeoutId);
    }
  };

  const sendMessage = () => {
    const recipientId = userRole === 'admin' && lastSenderId ? lastSenderId : adminRecipientId;

    if (ws && ws.readyState === WebSocket.OPEN && recipientId) {
      const formattedMessage = JSON.stringify({ recipientId, message: messageText });
      ws.send(formattedMessage);
      setMessages(prev => [...prev, { text: messageText, sender: 'self' }]);
      setMessageText('');
      setIsTyping(false);
    }
  };
  

  const openAddUserModal = () => {
    setShowAddUserModal(true);
  };

  const openAddDeviceModal = () => {
    setShowAddDeviceModal(true);
  };

  const closeAddUserModal = () => {
    setShowAddUserModal(false);
  };

  const closeAddDeviceModal = () => {
    setShowAddDeviceModal(false);
  };


  const handleAddUser = async () => {
    try {
      const response = await axios.post(REGISTER_URL, {
        username: newUsername,
        password: newPassword,
        role: newRole,
      });
      console.log('User added successfully:', response.data);
      setUsers([...users, response.data]); 
      setNewUsername('');
      setNewPassword('');
      setNewRole('');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleAddDevice = async () => {
    try {
      const response = await axios.post(ADD_DEVICE, {
        description : newDescription,
        address : newAddress,
        maximumHourlyEnergyConsumption: newMaximumHourlyEnergyConsumption,
        userId : newUserId
      });
      console.log('Device added successfully:', response.data);
      setDevices([...devices, response.data]); 

      setNewDescription('');
      setNewAddress('');
      setNewMaximumHourlyEnergyConsumption('');
      setNewUserId('');
    } catch (error) {
      console.error('Error adding device:', error);
    }
  };

  

  const deleteUser = async (userId) => {
    try {
        const token = localStorage.getItem('token'); 

        const config = {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        };

        const response = await axios.delete(`${GET_USERS}/${userId}`, config);
        console.log('User deleted successfully:', response.data);
        window.location.reload();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

  const deleteDevice = async (deviceId) => {
    try {
      const response = await axios.delete(`${GET_DEVICES}/${deviceId}`);
      console.log('Device deleted successfully:', response.data);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  const openEditModal = (user) => {
    setShowEditModal(true);
    setSelectedUser(user);
    setEditedUsername(user.username);
    setEditedPassword(user.password);
    setEditedRole(user.role);
  };

  const openEditModalDevice = (device) => {
    setShowEditModalDevice(true);
    setSelectedDevice(device);
    setEditedDescription(device.description);
    setEditedAddress(device.address);
    setEditedMaximumHourlyEnergyConsumption(device.maximumHourlyEnergyConsumption);
    setEditedUserId(device.userId);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const closeEditModalDevice = () => {
    setShowEditModalDevice(false);
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
      closeEditModal();
      window.location.reload();
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  const handleEditDevice = async () => {
    try {
      const response = await axios.put(`${GET_DEVICES}/${selectedDevice.id}`, {
        id: selectedDevice.id,
        description: editedDescription,
        address: editedAddress,
        maximumHourlyEnergyConsumption: editedMaximumHourlyEnergyConsumption,
        userId: editedUserId
      });
      console.log('Device edited successfully:', response.data);
      closeEditModalDevice();
      window.location.reload();
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); 
  
        const config = {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        };
  
        const response = await axios.get(GET_USERS, config); 
        setUsers(response.data);
      } catch (error) {
        setIsError(true);
      }
    };

    const fetchDevices = async () => {
      try {
          const token = localStorage.getItem('token'); 

          const config = {
              headers: {
                  'Authorization': `Bearer ${token}` 
              }
          };

          const response = await axios.get(GET_DEVICES, config); 
          setDevices(response.data);
      } catch (error) {
          setIsError(true);
      }
  };

    fetchUsers();
    fetchDevices();
  }, []);


useEffect(() => {
  console.log("intra");
        const fetchUserDevices = async () => {
           console.log("intra2");
          try {
            console.log(userId);
            const response = await axios.get(`${GET_USER_DEVICES}/${userId}`);
            if (response.status === 200) {
              console.log(response.data);
              setUserDevices(response.data);
            } else {
              console.error('Failed to fetch user devices');
            }
          } catch (error) {
            console.error('Error during device fetch:', error);
          }
        };
          fetchUserDevices();
        
      }, [userId]);

  return (
    <div className="homepage-container">
      <h2>Welcome to the Homepage</h2>
      {userRole === 'admin' ? (
        <div>
          <h3>You are logged in as an Admin</h3>
          <button onClick={openAddUserModal}>Add User</button>
          {showAddUserModal && (
        <div className="modal">
          <div className="modal-content">
            <span onClick={closeAddUserModal} style={{ float: 'right', cursor: 'pointer' }}>
              &times;
            </span>
            <h2>Add User</h2>
            <div>
              <label htmlFor="newUsername">Username:</label>
              <input
                type="text"
                id="newUsername"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="newPassword">Password:</label>
              <input
                type="text"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="newRole">Role:</label>
              <input
                type="text"
                id="newRole"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              />
            </div>
            <button onClick={handleAddUser}>Add</button>
            <button onClick={closeAddUserModal}>Close</button>
          </div>
        </div>
      )}
<button onClick={openAddDeviceModal}>Add Device</button>
{showAddDeviceModal && (
        <div className="modal">
          <div className="modal-content">
            <span onClick={closeAddDeviceModal} style={{ float: 'right', cursor: 'pointer' }}>
              &times;
            </span>
            <h2>Add Device</h2>
            <div>
              <label htmlFor="newDescription">Description:</label>
              <input
                type="text"
                id="newUDescription"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="newAddress">Address:</label>
              <input
                type="text"
                id="newAddress"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="newMaximumHourlyEnergyConsumption">MaximumHourlyEnergyConsumption:</label>
              <input
                type="text"
                id="newMaximumHourlyEnergyConsumption"
                value={newMaximumHourlyEnergyConsumption}
                onChange={(e) => setNewMaximumHourlyEnergyConsumption(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="newUserId">User Id:</label>
              <input
                type="text"
                id="newUserId"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
              />
            </div>
            <button onClick={handleAddDevice}>Add</button>
            <button onClick={closeAddDeviceModal}>Close</button>
          </div>
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
          {devices.map((device) => (
            <DeviceBox key={device.id} device={device} onDelete={deleteDevice} onEdit={() => openEditModalDevice(device)} />
          ))}
        </div>

        {showEditModalDevice && (
        <div className="edit-modal">
          <h2>Edit User</h2>
          <input type="text" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
          <input type="text" value={editedAddress} onChange={(e) => setEditedAddress(e.target.value)} />
          <input type="text" value={editedMaximumHourlyEnergyConsumption} onChange={(e) => setEditedMaximumHourlyEnergyConsumption(e.target.value)} />
          <input type="text" value={editedUserId} onChange={(e) => setEditedUserId(e.target.value)} />
          <button onClick={handleEditDevice}>Save Changes</button>
          <button onClick={closeEditModalDevice}>Cancel</button>
        </div>
      )}
        </div>
      ) : (
        <div>
          <h3>You are logged in as a Client</h3>
          <div>
          <h4>List of Devices:</h4>
          {userDevices.map((device) => (
            <DeviceBox key={device.id} device={device} onDelete={deleteDevice} onEdit={() => openEditModalDevice(device)} />
          ))}
        </div>
        </div>
        
      )}

<div className="chat-container">
<div className="messages">
    {messages.map((msg, index) => (
      <div key={index} className={`message ${msg.sender === 'self' ? 'sent' : 'received'}`}>
        <strong>{msg.sender === 'self' ? 'Sent: ' : 'Received: '}</strong> {msg.text}
      </div>
    ))}
  </div>

  {isTyping && <div className="typing-indicator">User is typing...</div>}
        <input 
          type="text" 
          value={messageText} 
          onChange={(e) => {
            setMessageText(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }} 
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Homepage;
