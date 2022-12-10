"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogout = exports.renderMovie = exports.renderDashboard = exports.renderHome = exports.renderSignup = exports.renderLogin = void 0;
const Movie_1 = __importDefault(require("../models/Movie"));
const jsonwebtoken_1 = require("jsonwebtoken");
const title = process.env.APP_NAME;
const secret = process.env.JWT_SECRET;
const send404 = (req, res, err) => {
    return res.status(404).render("404", {
        status: 404,
        message: "The page you're looking for was not found. Try checking your url for spelling mistakes",
        title: title + " | 404",
        user: req.cookies.username,
    });
};
const send500 = (req, res, err) => {
    return res.status(500).render("500", {
        status: 500,
        message: "The server encountered a problem while processing your request. We'll have this fixed soon",
        title: title + " | 500",
        user: req.cookies.username,
    });
};
async function renderLogin(req, res, next) {
    res.status(200).render("login", {
        title: title + " | Login",
        user: req.cookies.username,
    });
}
exports.renderLogin = renderLogin;
async function renderSignup(req, res, next) {
    res.status(200).render("register", {
        title: title + " | Signup",
        user: req.cookies.username,
    });
}
exports.renderSignup = renderSignup;
async function renderHome(req, res, next) {
    try {
        const limit = Number(req.query?.limit) || 5;
        const offset = Number(req.query?.offset) || 0;
        const user = req.cookies.username;
        const movies = await Movie_1.default.find({}).sort({ createdAt: 1 }).limit(limit).skip(offset);
        if (!!movies.length) {
            res.status(200).render("index", { movies, title: title + " | Home", user, limit, offset });
        }
        else if (offset > 0) {
            res.status(404).redirect('/?limit=' + limit + '&offset=' + (offset - limit));
        }
        else {
            res.status(200).render("index", { movies, title: title + " | Home", user, limit, offset });
        }
    }
    catch (error) {
        return send500(req, res, error);
    }
}
exports.renderHome = renderHome;
async function renderDashboard(req, res, next) {
    try {
        const limit = Number(req.query?.limit) || 5;
        const offset = Number(req.query?.offset) || 0;
        const { token, username } = req.cookies;
        if (token) {
            const verified = (0, jsonwebtoken_1.verify)(token, secret);
            if (!!verified) {
                const { id } = verified;
                const movies = await Movie_1.default.find({ createdBy: id }).sort({ createdAt: 1 }).limit(limit).skip(offset);
                return res.status(200).render("dashboard", {
                    title: title + " | Your Movies",
                    user: username,
                    movies,
                    limit,
                    offset
                });
            }
        }
    }
    catch (error) {
        return send500(req, res, error);
    }
}
exports.renderDashboard = renderDashboard;
async function renderMovie(req, res, next) {
    try {
        const { id } = req.params;
        const movie = await Movie_1.default.findById(id);
        if (!movie) {
            return send404(req, res, { message: "Page Not Found" });
        }
        res.status(200).render("movie", {
            movie,
            title: title + " | " + movie.title,
            user: req.cookies.username,
        });
    }
    catch (error) {
        return send500(req, res, error);
    }
}
exports.renderMovie = renderMovie;
async function handleLogout(req, res, next) {
    delete req.user;
    res
        .cookie("token", "", { expires: new Date(0) })
        .cookie("username", "", { expires: new Date(0) })
        .status(200)
        .redirect("/");
}
exports.handleLogout = handleLogout;
