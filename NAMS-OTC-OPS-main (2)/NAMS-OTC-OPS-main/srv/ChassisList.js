const client = require('./ChassisListClient');

module.exports = class ChassisList {

    getSalesOrdersForMultiple(materials) {
        return new Promise((resolve, reject) => {
            client.getSalesOrdersForMultiple(materials)
                .then(orders => {
                    resolve(orders.map(order => ({ salesOrder: order.SalesOrder.padStart(10, '0'), material: order.Chassis })))
                })
                .catch(err => {
                    reject(err)
                })
        });
    }

}
