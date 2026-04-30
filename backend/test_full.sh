node server.js &
SERVER_PID=$!
sleep 2
node test_add_note3.js
sleep 2
kill $SERVER_PID
