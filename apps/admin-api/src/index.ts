import StatusRoute from './status';
import { Plugin } from '@hapi/hapi';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const routes: Plugin<any>[] = [StatusRoute];
