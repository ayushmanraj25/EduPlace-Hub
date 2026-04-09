const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://flzwcwovvzwhcqwkwvny.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsendjd292dnp3aGNxd2t3dm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5Mjk4MDMsImV4cCI6MjA4OTUwNTgwM30.Hz9q16bfOpxbowZu0NDReUDAy_OP_IYukdB1X0iNSJI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const email = 'testuser_' + Date.now() + '@example.com';
  console.log('Testing signUp with', email);
  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'password123',
  });
  console.log('SignUp Data:', JSON.stringify(data, null, 2));
  console.log('SignUp Error:', error);
}
test();
