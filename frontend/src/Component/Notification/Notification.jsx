const Notification = ({ message }) => {
  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#4caf50',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease-out'
    }}>
      {message}
    </div>
  );
};