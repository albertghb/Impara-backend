// Test login endpoint
const testLogin = async () => {
  try {
    console.log('Testing login endpoint...');
    console.log('URL: http://localhost:4000/api/auth/login');
    
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@impara.com',
        password: 'admin123'
      })
    });

    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('Token:', data.token);
      console.log('User:', data.user);
    } else {
      console.log('❌ Login failed');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Make sure the backend server is running on port 4000');
  }
};

testLogin();
