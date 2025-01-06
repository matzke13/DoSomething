import asyncHandler from 'express-async-handler';
import * as model from '../model/model.js';

// eslint-disable-next-line import/prefer-default-export
export const getTasks = asyncHandler(async (req, res) => {
  res.status(200).json(await model.getTasks());
});
