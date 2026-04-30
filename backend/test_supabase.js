const supabase = require('./config/supabase');
async function test() {
  const { data, error } = await supabase
    .from('notes')
    .insert([{ subject: "Test", topic: "Test", content: "Test", user_id: 'test' }])
    .select();
  console.log("Error:", error);
  console.log("Data:", data);
}
test();
