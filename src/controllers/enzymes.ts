import {RequestHandler} from 'express';

import * as ENZYMES from './../neb-data-miner';

export const getEnzymes: RequestHandler = (req, res, next) => {
    res.status(201).json({enzymes: ENZYMES});
};