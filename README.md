# mongoose-page-query
a small plugin just about forty codes that is used for the implemention of page query,
it depends on mongoose and your environment support async functions.

## tables of contents
   1. [install](#install)
   2. [usage](#usage)
   3. [api](#api)
   4. [custom](#custom)

### install 
   <span id='install'></span>Install mongoose-page-query like this:
  `$ npm install --global ava`
  before this you must install mongoose.
### usage
  <span id='usage'></span>use it as global plugin for every schema in mongoose when you connect databases.
  ````
     const mongoose = require('mongoose');
     const pageQuery = require('mongoose-page-query');
     mongoose.plugin(pageQuery);
   ```` 
  use it as a schema plugin like this.
  ````
    const mongoose = require('mongoose');
    const pageQuery = require('mongoose-page-query');
    const schema = new mongoose.Schema({ /* schema definition */ });
    schema.plugin(pageQuery); 
    const Model = mongoose.model('Model',  schema); // Model.pageQuery()
  ````
### api    
   <span id='api'></span>Model.pageQuery({page,row},condition,projection,option)you need use it in async functions.
   ````
     async function test() {
          //result {page: 1, row: 10, total: totalCount, rows: [data]}
         let result = await Model.pageQuery({page: 1,row: 10}, {}, {}, {});
         }  
   ````
   the four params must be specified. if you don not need ,just specify
       it as null.
                          
### Set custom default options for all queries 
   <span id='custom'></span>Set custom default options for all queries.this plugin has three default three params,
   lean:true,page:1,row:10.you can specific page and row param like this:
   ````  
      const mongoose = require('mongoose');
      const pageQuery = require('mongoose-page-query');
      pageQuery.defaultOption = {page: 1, row: 20};
   ````
   you can not set lean default value and just specify it in api option param,eg:
   ````
     async function test() {
                 let result = await Model.pageQuery({page: 1,row: 10}, {}, {}, {lean: false})
           }  
   ````
    

      
