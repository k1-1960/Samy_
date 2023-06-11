import { config } from 'dotenv'
import { resolve } from 'path'
import { connect } from './utils/db';

config({ path: resolve(__dirname, '..', '.env') })
connect();

import './client'
