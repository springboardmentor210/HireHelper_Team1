import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to Hire-a-Helper</h1>
      <p>Please login or register to continue.</p>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <Link to="/login" style={{ padding: '10px 20px', background: '#111', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Go to Login
        </Link>
        <Link to="/register" style={{ padding: '10px 20px', background: '#111', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Go to Register
        </Link>
      </div>
    </div>
  );
};



export default Home;