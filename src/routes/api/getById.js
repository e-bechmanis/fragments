// src/routes/api/getById.js

const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');
/**
 * Gets an authenticated user's fragment data (i.e., raw binary data) with the given id
 */
module.exports = async (req, res) => {
  try {
    logger.info('Trying to get user fragment by id // GET /v1/fragments/:id');
    const fragment = await Fragment.byId(req.user, req.params.id);
    logger.debug({ fragment });
    const fragmentData = await fragment.getData();
    const fragmentType = fragment.type;

    res.set('Content-Type', fragmentType);
    logger.info('Fragment is successfully read');
    res.status(200).send(fragmentData);
  } catch (err) {
    logger.error(err);
    res.status(404).json(createErrorResponse(404, err));
  }
};
