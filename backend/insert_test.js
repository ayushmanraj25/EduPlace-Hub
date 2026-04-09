const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const supabase = require('./config/supabase');

async function testInsert() {
  console.log('Testing Supabase Insert...');
  if (!supabase) {
    console.error('Supabase not initialized! Check config.');
    return;
  }

  const newQuestion = {
    company: 'Test Company',
    type: 'Technical',
    question: 'How do you test Supabase?',
    answer: 'By inserting a row directly!',
    year: 2026
  };

  const { data, error } = await supabase
    .from('company_questions')
    .insert([newQuestion])
    .select();

  if (error) {
    console.error('Insert Error:', error.message);
  } else {
    console.log('Insert Success! Data:', data);
  }
}

testInsert();
