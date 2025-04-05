/* eslint-disable @typescript-eslint/no-explicit-any */

import QueryBuilder from '../../builder/QueryBuilder';
import { IMyRequest } from '../../utils/decoded';
import { Contacts } from './contact.model';

// Create a new user
const createContacts = async (payload: any) => {
  const result = await Contacts.create({ ...payload });
  return result;
};

const getContacts = async (req: IMyRequest) => {
  
  const query = req?.query || {};


  const queryBuilder = new QueryBuilder(
    Contacts.find(),
    query as Record<string, unknown>,
  );

  queryBuilder.search([]).filter().dateFilter('createdAt').sort().paginate();

  const exported = new QueryBuilder(
    Contacts.find(),
    query as Record<string, unknown>,
  );

  exported.search([]).filter().dateFilter('createdAt').sort().paginate();

  const result = await queryBuilder.modelQuery;
  const exportData = await exported.modelQuery;
  const meta = await queryBuilder.countTotal();


  return {result ,meta, exportData};

};

export const contactsServices = {
  createContacts,
  getContacts,
};
