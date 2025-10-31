import mysql from 'mysql2/promise';

async function testConnection() {
  try {
    console.log('Testing MySQL connection...');
    console.log('Host: localhost');
    console.log('User: root');
    console.log('Password: (empty)');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'impara_news'
    });
    
    console.log('✅ Connected successfully!');
    await connection.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Solutions:');
      console.log('1. Your MySQL root user needs a password. Set it in .env');
      console.log('2. Or run this in MySQL: ALTER USER \'root\'@\'localhost\' IDENTIFIED WITH mysql_native_password BY \'\';');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 MySQL is not running. Start MySQL service.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Database doesn\'t exist. Run: CREATE DATABASE impara_news;');
    }
  }
}

testConnection();
