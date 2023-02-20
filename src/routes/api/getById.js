// src/routes/api/getById.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
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

    logger.info('Fragment is successfully read');
    return res
      .set('Content-Type', fragmentType) // set Content-Type in header
      .status(200)
      .json(createSuccessResponse({ fragment: fragmentData }));
  } catch (err) {
    logger.error(err);
    return res.status(404).json(createErrorResponse(404, err));
  }
};
