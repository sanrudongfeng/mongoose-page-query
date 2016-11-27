const test = require('ava');
const assert = require('assert');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
//const pageQueryPlugin = require('../index');
/**
 * ava引入测试框架不支持引入的外部文件之中包含async函数，
 * 将分页函数拷贝过来
 */
function pageQueryPlugin ( schema ) {
    schema.statics.pageQuery = async function ( item = {} , condition = {} , projection = {} , option = {} ) {
        if ( !item.page && !item.row )item = pageQueryPlugin.pageOpt;//支持传递空对象
        if ( typeof item.page != 'number' || typeof item.row != 'number' ) {
            throw('pageQuery method pageParams must be number type');
        }
        let {page , row} = item;
        if ( page < 1 ) {
            page = 1;
        }
        if ( row <= 0 ) {
            row = 10;
        }
        let rs = {
            rows : [] ,
            page : page ,
            row  : row ,
            total: 0
        };
        let total = await this.count(condition);
        if ( !total ) {
            return rs;
        }
        rs.total = total;
        rs.rows = await this.find(condition , projection , Object.assign({lean: true} , option , {
            limit: row ,
            skip : (page - 1) * row
        }));
        return rs;
    }
}
pageQueryPlugin.pageOpt = {page: 1 , row: 10};



const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String ,
    age : Number
});

pageQueryPlugin.pageOpt = {page: 1 , row: 3};
mongoose.plugin(pageQueryPlugin);
const User = mongoose.model('User' , userSchema);

const dbUrl = 'mongodb://127.0.0.1/test';
test.before('mongoose-page-query' , async t => {
    mongoose.connect(dbUrl);
    await User.remove({});
    await User.create([
        {name: 'a1' , age: 3} ,
        {name: 'a2' , age: 5} ,
        {name: 'a3' , age: 1} ,
        {name: 'a4' , age: 2} ,
        {name: 'a5' , age: 4}
    ]);
});
test('mongoose-page-query' , async t => {
    let userList = await User.pageQuery({page: 1 , row: 2} , {} , {_id: 0 , __v: 0} , {sort: {age: -1}});
    assert.deepEqual(userList , {
        page : 1 ,
        row  : 2 ,
        rows : [
            {name: 'a2' , age: 5} ,
            {name: 'a5' , age: 4}
        ] ,
        total: 5
    });
    t.pass();
});

test('mongoose-page-query' , async t => {
    let userList = await User.pageQuery({page: -1 , row: 2} , {} , {_id: 0 , __v: 0} , {sort: {age: -1}});
    assert.deepEqual(userList , {
        page : 1 ,
        row  : 2 ,
        rows : [
            {name: 'a2' , age: 5} ,
            {name: 'a5' , age: 4}
        ] ,
        total: 5
    });
    t.pass();
});


test('mongoose-page-query' , async t => {
    let userList = await User.pageQuery({page: 1 , row: 0} , {} , {_id: 0 , __v: 0} , {sort: {age: -1}});
    console.log(userList);
    assert.deepEqual(userList , {
        page : 1 ,
        row  : 10 ,
        rows : [
            {name: 'a2' , age: 5} ,
            {name: 'a5' , age: 4} ,
            {name: 'a1' , age: 3} ,
            {name: 'a4' , age: 2} ,
            {name: 'a3' , age: 1}

        ] ,
        total: 5
    });
    t.pass();
});
