import * as cache from 'memory-cache';

export default class {
  put(id: string, data: string): void {
    cache.put(id, data);
  }
  get(id: string): string {
    return cache.get(id);
  }
  delete(id: string): void {
    cache.del(id);
  }
  clear(): void {
    cache.clear();
  }
}
