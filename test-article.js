// Test script to create an article
const testArticle = async () => {
  try {
    // First login to get token
    const loginRes = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });
    
    const { token } = await loginRes.json();
    console.log('✅ Logged in successfully');
    
    // Create article
    const articleRes = await fetch('http://localhost:4000/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Test Article ' + Date.now(),
        content: 'This is a test article content',
        excerpt: 'Test excerpt',
        imageUrl: '/uploads/test.jpg',
        categoryId: 1,
        authorId: 1,
        isBreaking: false,
        isFeatured: false,
        status: 'published'
      })
    });
    
    if (!articleRes.ok) {
      const error = await articleRes.json();
      console.error('❌ Failed to create article:', error);
      return;
    }
    
    const article = await articleRes.json();
    console.log('✅ Article created successfully:', article);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testArticle();
