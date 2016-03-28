'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.query.QueryExecutor');

/** 
 * An executor that will execute queries for the caller.
 *
 * @constructor
 * @memberof restak.query
 * @param {restak.query.QueryFactory} queryFactory - The factory to use to access queries.
 */
var QueryExecutor = function(queryFactory){

	/** 
	 * The query factory used to access queries.
	 *
	 * @type restak.query.QueryFactory
	 */
	this.queryFactory = queryFactory;
};

/** 
 * Execute a query.
 *
 * @param {string} queryKey - The key of the query to execute.
 * @param {restak.query.QueryRequest} queryRequest - The queryRequest.
 * @param {restak.query.Query~Callback} The callback that handles the query result.
 */
QueryExecutor.prototype.executeQuery = function(queryKey, queryRequest, callback){
	
	var query;

	try{
		query = this.queryFactory.getQuery(queryKey);	
	
	} catch(err) {
		logger.error('Asked to execute an unknown query ' + queryKey);
		logger.error(err);

		callback(err, null);
		return;
	}

	if(logger.isDebugEnabled()) {
		logger.debug('Executing query [' + queryKey + ']: ' + JSON.stringify(queryRequest));
	}
	
	query.execute(queryRequest, function(err, qResult){

		if(err){
			logger.error('An error occurred executing query [' + queryKey + ']');
			logger.error(err);
		} else {
			if(logger.isDebugEnabled()) {
				logger.debug('Query [' + queryKey + '] returned ' + qResult.totalCount + ' items for query: ' + JSON.stringify(queryRequest));
			}
		}

		callback(err, qResult);
	});
};

module.exports = QueryExecutor;