import type express from 'express';

import { Container } from 'typedi';
import { validCursor } from '../../shared/middlewares/global.middleware';
import { encodeNextCursor } from '../../shared/services/pagination.service';
import type { InstalledNodeRequest } from '../../../types';
import { NodeTypes } from '@/NodeTypes';

export = {
	getInstalledNodes: [
		validCursor,
		async (req: InstalledNodeRequest.GetAll, res: express.Response): Promise<express.Response> => {
			const { offset = 0, limit = 100 } = req.query;

			let results = []
			
			const nodeTypes = Container.get(NodeTypes)
			const knownNodeTypes = nodeTypes.getKnownTypes()
			const knownNodeTypesClassNames = Object.keys(knownNodeTypes)
			const rangeKnownNodeTypesClassNames = knownNodeTypesClassNames.slice(offset, offset + limit)
			for (let knownNodeTypeClassName of rangeKnownNodeTypesClassNames) {
				let nodeTypeInfo = nodeTypes.getByName(knownNodeTypeClassName)
				results.push({
					className: knownNodeTypeClassName,
					displayName: nodeTypeInfo.description.displayName,
					description: nodeTypeInfo.description.description
				})
			}

			return res.json({
				data: results,
				nextCursor: encodeNextCursor({
					offset,
					limit,
					numberOfTotalRecords: knownNodeTypesClassNames.length,
				}),
			});
		},
	],
};
