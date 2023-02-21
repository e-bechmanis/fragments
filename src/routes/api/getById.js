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
    logger.debug('Read fragment metadata');
    logger.debug({ fragment });
    const fragmentData = await fragment.getData();
    const fragmentType = fragment.type;
    const fragmentDataSize = fragment.size;

    logger.info('Fragment is successfully read');
    logger.debug(`Fragment type ` + fragmentType);
    logger.debug(`Fragment size ` + fragmentDataSize);

    // set Content-type and Content-Length in response header
    return res
      .set('content-type', fragmentType)
      .set('content-length', fragmentDataSize)
      .status(200)
      .send(fragmentData);
  } catch (err) {
    logger.error(err);
    return res.status(404).json(createErrorResponse(404, err));
  }
};
