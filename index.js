function pageQueryPlugin ( schema , opt = {page: 0 , row: 10} ) {
    schema.statics.pageQuery = async function ( item = opt , condition = {} , projection = {} , option = {} ) {
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


module.exports = pageQueryPlugin;
