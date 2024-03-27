// ----------------------------------------------------------
// IMPORTANDO
// ----------------------------------------------------------

import "dotenv/config";
import {usersModel} from "../models/users.model.js";
import ProcessConsole from "../lib/processconsole.js";
import bcript from "bcryptjs";
import jwt from "jsonwebtoken";

// ----------------------------------------------------------
// DECLARACION DE VARIABLES E INSTANCIANDO OBJETOS
// ----------------------------------------------------------

const timeExpireToken = 600; //time in seconds

// ----------------------------------------------------------
// FUNCION - register
// ----------------------------------------------------------

const register = async (req, res, next) => {

    ProcessConsole.delete();
    ProcessConsole.add("users.controller.register: Start");

    try {

        const user = await req.body;
        let newUser;

        if(!user){

            ProcessConsole.add("users.controller.register: Error - Post is required");
            return res.status(400).json({message:"Post is required", result: null});
        }
        else if(!user.email || !user.password || !user.rol || !user.language){

            ProcessConsole.add("users.controller.register: Error - Every user data is required");
            return res.status(400).json({message:"Every user data is required", result: null});
        }
        else{

            newUser = {email: user.email, password: bcript.hashSync(user.password, 10), rol: user.rol, language: user.language};
            const posted = await usersModel.createUser(newUser);
            ProcessConsole.add("users.controller.register: Posted");
            return res.status(201).json({message:"Posted", result: posted});
        }

    } catch (error) {

        ProcessConsole.add("users.controller.register: Error");
        
        if(error.code === "23505"){

            ProcessConsole.add("users.controller.register: Error - User already exists");
            return res.status(400).json({ message: "User already exists", result: error});
        }
        else{

            ProcessConsole.add(error.message);
            return res.status(500).json({message: "Internal server error", result: error});
        }
    }
    finally{

        ProcessConsole.add("users.controller.register: Closed");
        next();
    }
};

// ----------------------------------------------------------
// FUNCION - login
// ----------------------------------------------------------

const login = async function (req, res, next){

    ProcessConsole.delete();
    ProcessConsole.add("users.controller.login: Start");

    try {
        
        const {email, password} = await req.body;
        const user = await usersModel.findByEmail(email);
        
        if(!user){

            ProcessConsole.add("users.controller.login: Error - User not found");
            return res.status(404).json({message:"User not found", result: null});
        }
        else{

            const isMatch = bcript.compareSync(password, user.password);

            if(!isMatch){

                ProcessConsole.add("users.controller.login: Error - Invalid credentials");
                return res.status(400).json({message:"Invalid credentials", result: null});
            }
            else{

                const payload = {email: email, user_id: user.id};
                const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: timeExpireToken});
                ProcessConsole.add("users.controller.login: Login successfully");
                return res.status(200).json({message:"Login successfully", result: token});
            }
        }
    } catch (error) {

        ProcessConsole.add("users.controller.login: Error");
        ProcessConsole.add(error.message);
        return res.status(500).json({message: "Internal server error", result: error}); 
    }
    finally{

        ProcessConsole.add("users.controller.login: Closed");
        next();
    }
};

// ----------------------------------------------------------
// FUNCION - readUserByHeader
// ----------------------------------------------------------

const readUserByHeader = async (req, res, next) => {

    ProcessConsole.delete();
    ProcessConsole.add("users.controller.readUserByHeader: Start");
    
    try {

        const Authorization = await req.header("Authorization");
        const token = Authorization.split(" ")[1];

        if(jwt.verify(token, process.env.JWT_SECRET)){

            const {email, user_id} = jwt.decode(token);
            const user = await usersModel.findById(user_id);

            if(!user){

                ProcessConsole.add("users.controller.readUserByHeader: Error - User not found");
                return res.status(404).json({message:"User not found", result: null});
            }
            else{

                ProcessConsole.add("users.controller.readUserByHeader: Success");
                return res.status(200).json({message:"Success", result: user});
            }
        }
        else{

            ProcessConsole.add("users.controller.readUserByHeader: Error - Invalid credentials");
            return res.status(400).json({message:"Invalid credentials", result: null});
        }

    } catch (error) {

        ProcessConsole.add("users.controller.readUserByHeader: Error");
        ProcessConsole.add(error.message);
        return res.status(error.code || 500).json({message: "Internal server error", result: error}); 
    }
    finally{

        ProcessConsole.add("users.controller.readUserByHeader: Closed");
        next();
    }
};

// ----------------------------------------------------------
// FUNCION - notFoundRoute
// ----------------------------------------------------------

const notFoundRoute = async (req, res,next) => {

    ProcessConsole.delete();
    ProcessConsole.add("Not Found Route");
    res.status(404).json({message:"Not Found Route", result: null});
    next();
};

// ----------------------------------------------------------
// FUNCION - report
// ----------------------------------------------------------

const report =  function(){

    return (req, res, next) => {

        console.log("-------------------------------");
        console.log(`Request URL: ${req.originalUrl}`);
        console.log(`Request Type: ${req.method}`);
        next();
    };
};

// ----------------------------------------------------------
// FUNCION - reportDetail
// ----------------------------------------------------------

const reportDetail =  async (req, res) => {

        const stringReport = ProcessConsole.print();
        console.log(stringReport);
        return;
};

const welcome =  async (req, res) => {

    return res.status(200).json({message:"Welcome", response: null});
};

// ----------------------------------------------------------
// EXPORTANDO
// ----------------------------------------------------------

export const usersController = {welcome, register, login, readUserByHeader, notFoundRoute, report, reportDetail};