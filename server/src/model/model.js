import { query } from '../../boilerplate/db/index.js';

// eslint-disable-next-line import/prefer-default-export
export const getTasks = async () => {
  const { rows } = await query("SELECT * FROM Tasks;");
  return rows;
};
