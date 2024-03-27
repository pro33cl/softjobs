// ----------------------------------------------------------
// IMPORTANDO
// ----------------------------------------------------------

import {usersController} from "../controllers/users.controller.js";
import {Router} from "express";

// ----------------------------------------------------------
// DECLARACION DE VARIABLES
// ----------------------------------------------------------

const router = Router();

// ----------------------------------------------------------
// GET
// ----------------------------------------------------------

router.get("/", usersController.welcome);

router.get("/users/", usersController.readUserByHeader, usersController.reportDetail);

// ----------------------------------------------------------
// POST
// ----------------------------------------------------------

router.post("/login/", usersController.login, usersController.reportDetail);

router.post("/users/", usersController.register, usersController.reportDetail);

// ----------------------------------------------------------
// EXPORTANDO
// ----------------------------------------------------------

export default router;