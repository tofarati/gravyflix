"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const movie_1 = require("../controllers/movie");
const router = (0, express_1.Router)();
router.get("/", movie_1.getMovies);
router.post("/", auth_1.auth, movie_1.addMovie);
router.put("/", auth_1.auth, movie_1.addOrUpdateMovie);
router.get("/:id", movie_1.getMovie);
router.patch("/:id", auth_1.auth, movie_1.updateMovie);
router.delete("/:id", auth_1.auth, movie_1.deleteMovie);
exports.default = router;
