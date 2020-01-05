import { IsolationLevel } from "../../driver/driver-types/IsolationLevel";

export interface TransactionOptions {
  connectionName?: string;
  isolation?: IsolationLevel;
}