import * as cache from 'memory-cache';

export default class {
  constructor() {}

  put(id: string, data: string) {
    return cache.put(id, data);
  }
  get(id: string) {
    return cache.get(id);
  }
  delete(id: string) {
    return cache.del(id);
  }
  clear() {
    cache.clear();
  }
}
