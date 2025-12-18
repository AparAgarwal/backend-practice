import { nanoid } from "nanoid";
import Url from "../models/url.model.js";

export const createShortUrl = async (req, res) => {
    const redirectUrl = req.body.redirectUrl;
    const shortId = nanoid(8);
    console.log(shortId);
    await Url.create({shortId, redirectUrl});
    return res.status(201).json({msg: "Success", data: shortId});
}

export const redirectToUrl = async (req, res) => {
    const {shortId} = req.params;
    const url = await Url.findOne({shortId});
    if(!url) return res.status(404).json({error: "This url doesn't exists"});
    return res.redirect(url.redirectUrl);
}