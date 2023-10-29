import React from 'react';

const DeviceBox = ({ device, onDelete, onEdit }) => {
  const boxStyle = {
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '10px',
    margin: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  };

  const buttonStyle = {
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '8px 16px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '5px',
  };

  return (
    <div style={boxStyle}>
      <p style={{ flex: 1 }}>Device: {device.description}</p>
      <div>
        <button style={buttonStyle} onClick={() => onEdit(device.id)}>
          Edit
        </button>
        <button style={{ ...buttonStyle, backgroundColor: '#f44336' }} onClick={() => onDelete(device.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeviceBox;
