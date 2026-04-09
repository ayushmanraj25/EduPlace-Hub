const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const supabase = require('./config/supabase');

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY);
console.log('Supabase initialized:', !!supabase);

async function test() {
  if (!supabase) {
    console.log('Supabase client is null');
    return;
  }
  try {
    const { data: data1, error: error1 } = await supabase.from('notes').select('*').limit(1);
    if (error1) {
      console.error('Notes table error:', error1.message);
    } else {
      console.log('Notes table exists!');
    }

    const { data: data2, error: error2 } = await supabase.from('placement_questions').select('*').limit(1);
    if (error2) {
      console.error('Placement table error:', error2.message);
    } else {
      console.log('Placement table exists!');
    }

    const { data: data3, error: error3 } = await supabase.from('company_questions').select('*').limit(1);
    if (error3) {
      console.error('Company Questions table error:', error3.message);
    } else {
      console.log('Company Questions table exists!');
    }
  } catch (err) {
    console.error('Exception during Supabase test:', err.message);
  }
}

test();
