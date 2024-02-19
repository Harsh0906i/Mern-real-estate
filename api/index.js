let express = require('express');
let mongoose=require('mongoose');
let UserRouter=require('./routes/User')
let app = express();

app.use('/api/user',UserRouter)
main()
    .then(() => {
        console.log("success");
    }).catch((err) => {
        console.log(err);
    });
async function main() {
    await mongoose.connect('mongodb+srv://harshitsingharya24:rFkHIdbVHfG8BqIe@cluster0.jwjbl5k.mongodb.net/?retryWrites=true&w=majority');
};
app.listen(8080, () => {
    console.log('Running on port 8080');
})