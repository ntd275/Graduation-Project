const knex = require("./database");

exports.getAccount = (accountId) => {
    return knex("account").where("accountId", accountId).first();
};

exports.getAccountList = (accountId) => {
    return knex("account").whereIn("accountId", accountId);
}

exports.getAccountByEmail = (email) => {
    return knex("account").where("email", email).first();
}

exports.createAccount = (account) => {
    return knex("account").insert({
        ...account,
        dateOfBirth: new Date(account.dateOfBirth),
    });
}

exports.editAccount = (id, data) => {
    return knex('account')
        .where('accountId', id)
        .update({
            ...data,
        })
}

exports.deleteAccount = (accountId) => {
    return knex('account').where('accountId', accountId).del()
}

exports.searchByName = (accountName,gender, page, perPage) => {
    if(gender !==undefined) {
        return knex('account').whereRaw('LOWER(name) LIKE ?', '%'+ accountName.toLowerCase()+'%').andWhere("gender", gender).paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
    }
    return knex('account').whereRaw('LOWER(name) LIKE ?', '%'+accountName.toLowerCase()+'%').paginate({ perPage: perPage, currentPage: page, isLengthAware: true })
}

exports.updatePassword = (accountId, newPassword) => {
    return knex('account').where('accountId', accountId).update('password', newPassword)
}