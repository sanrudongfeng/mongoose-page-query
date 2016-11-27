const mongoose = require('mongoose');
mongoose.Promise = Promise;
const pageQueryPlugin = require('../index');


const dbUrl = 'mongodb://127.0.0.1/test';

const Schema = mongoose.Schema;

mongoose.connect(dbUrl);
const userSchema = new Schema({
    name: String ,
    age : Number
});


mongoose.plugin(pageQueryPlugin);
const User = mongoose.model('User' , userSchema);


/*User.find({},function(err,doc){
    console.log('doc',doc);
})*/
console.log(typeof 1);
(async function (){
   let result =await  User.pageQuery({page:1,row:2},{},{},{sort:{age:-1}});
    console.log('result',result);
})();


/*
test.before(t => {
    mongoose.connect(dbUrl);
});
test('mongoose-pageQuery',t => {
    
});*/
