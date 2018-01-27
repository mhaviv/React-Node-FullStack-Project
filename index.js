const express = require('express');
const app = express();

app.get('/', (req,res) => {
	res.send({ hi: 'there' })
})

// process.env.PORT is for production and 5000 is for development
// This is called Dynamic Port Binding
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server ${PORT} is running!`));