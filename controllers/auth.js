const {response} = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generationJWT } = require("../jwt/jwt");

const createUser = async (req, res=response) => {

    const {email, password} = req.body;

    try {

        const existEmail = await User.findOne({email});
        if(existEmail) {
            return res.status(400).json(
                {
                    ok: false,
                    msg: "inappropriate data for registration"
                }
            )
        }   
        const userRequest = User(req.body);
        //encriptacion
        const salt =  bcrypt.genSaltSync();
        userRequest.password = bcrypt.hashSync(password, salt);

        await userRequest.save();

        // generar JWT
        const JWT = await generationJWT(userRequest.id);

        res.json({
            ok: true,
            msg: userRequest,
            JWT
        });
        
    } catch (error) {
        console.log(`error en createUser`, error);
        res.status(500).json({
            ok: false,
            msg: "please, contact to the admin"
        })
        
    }

    

}

const login = async (req, res=response) => {

    const {email, password} = req.body;


    try {

        const userLogin = await User.findOne({ email });
       
        if(!userLogin) return res.status(404).json({ok: false, msg: "data incorrect"});
         // validacion del pasword
         const isValidPassword =  bcrypt.compareSync(password, userLogin.password);
         if(!isValidPassword) return res.status(404).json({ok: false, msg: "data incorrect"});
          // generar JWT
          const JWT = await generationJWT(userLogin.id);
            return res.json({
                    ok: true,
                    msg: userLogin,
                    JWT
                })
        
    } catch (error) {

        console.log(`error en login`, error);
        res.status(500).json({
            ok: false,
            msg: "please, contact to the admin"
        })

        
    }
    

}

const renewJWT = async (req, res=response) =>{

    const uid = req.uid;
    const newToken = await generationJWT( uid );
    const user = await User.findById( uid );


    res.json({
        ok: true,
        msg: user,
        JWT: newToken
    })
}

module.exports = {
    createUser, login, renewJWT
}

