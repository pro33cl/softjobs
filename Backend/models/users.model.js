// ----------------------------------------------------------
// IMPORTANDO
// ----------------------------------------------------------

import {pool} from "../database/connection.js";
import format from "pg-format";
import ProcessConsole from "../lib/processconsole.js";

// ----------------------------------------------------------
// FUNCION - findByEmail
// ----------------------------------------------------------

const findByEmail = async function(email){

    ProcessConsole.add("users.model.findByEmail: Start");
    const query = "SELECT * FROM usuarios WHERE email = '%s'";
    const values = email;
    const formattedQuery = format(query, values);
    const {rows, rowCount} = await pool.query(formattedQuery);
    ProcessConsole.add(`users.model.findByEmail: Resultados = ${rowCount}`);
    ProcessConsole.add("users.model.findByEmail: Closed");
    return rows[0];
};

// ----------------------------------------------------------
// FUNCION - findById
// ----------------------------------------------------------

const findById = async function(id){

    ProcessConsole.add("users.model.findById: Start");
    const query = "SELECT * FROM usuarios WHERE id = %s";
    const values = id;
    const formattedQuery = format(query, values);
    const {rows, rowCount} = await pool.query(formattedQuery);
    ProcessConsole.add(`users.model.findById: Resultados = ${rowCount}`);
    ProcessConsole.add("users.model.findById: Closed");
    return {email: rows[0].email, rol: rows[0].rol, language: rows[0].language };
};

// ----------------------------------------------------------
// FUNCION - createUser
// ----------------------------------------------------------

const createUser = async function(user){

    ProcessConsole.add("users.model.createUser: Start");
    const query = "INSERT INTO usuarios (email, password, rol, language) VALUES ('%s', '%s', '%s', '%s') RETURNING *";
    const values = [user.email, user.password, user.rol, user.language];
    const formattedQuery = format(query, ...values);
    const {rows} = await pool.query(formattedQuery);
    ProcessConsole.add("users.model.createUser: Closed");
    return {id: rows[0].id, email: rows[0].email, rol: rows[0].rol, language: rows[0].language };
};

// ----------------------------------------------------------
// EXPORTANDO
// ----------------------------------------------------------

export const usersModel = {findById, findByEmail, createUser};