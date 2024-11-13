import { Repository } from "./repository";
import { SqlRepository } from "./sql_repository";
const repository: Repository = new SqlRepository();
export default repository;