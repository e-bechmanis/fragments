// src/routes/api/delete.js

const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.info('Fragment deletion is triggered');
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    logger.debug({ fragment }, `owner: ${req.user}`);
    await Fragment.delete(req.user, req.params.id);
    res.status(200).json(createSuccessResponse());
  } catch (err) {
    if (err.message.startsWith('Could not locate')) {
      logger.warn(`Couldn't find a fragment ${req.params.id}. Aborting delete process`);
      return res
        .status(404)
        .json(createErrorResponse(404, `Could not locate fragment. Fragment id: ${req.params.id}`));
    }
    logger.error(`An error occurred while trying to delete the fragment: ${err}`);
    res.status(500).json(createErrorResponse(500, err.message));
  }
};
