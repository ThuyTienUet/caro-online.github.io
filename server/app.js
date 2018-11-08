let path = require('path');
let express = require('express');
let app = express();

app.use(express.static(path.join(__dirname, '../client')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(5000, function () {
	console.log('\n============================ LISTENING ON PORT 5000================================\n');
});
