const {response} = require("express");

const createUser = (req, res=response) => {

    res.json({
        ok: true,
        msg: "Create user by controller"
    });

}

module.exports = {
    createUser
}