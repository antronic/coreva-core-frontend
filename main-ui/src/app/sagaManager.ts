// app/sagaManager.ts
import type { Task } from 'redux-saga';
import createSagaMiddleware from 'redux-saga';

export const sagaMiddleware = createSagaMiddleware();
const runningSagas = new Map<string, Task>();

export const sagaManager = {
  run(key: string, saga: () => Generator) {
    if (runningSagas.has(key)) {
      console.warn(`Saga with key "${key}" is already running`);
      return;
    }

    try {
      const task = sagaMiddleware.run(saga);
      runningSagas.set(key, task);
      console.log(`🚀 Started saga: ${key}`);

      // Handle saga completion
      task.toPromise().catch(() => {
        // Saga was cancelled or errored, remove from tracking
        runningSagas.delete(key);
      });
    } catch (error) {
      console.error(`Failed to start saga "${key}":`, error);
    }
  },

  cancel(key: string) {
    const task = runningSagas.get(key);
    if (!task) {
      console.warn(`Saga with key "${key}" is not running`);
      return;
    }

    task.cancel();
    runningSagas.delete(key);
    console.log(`⏹️ Cancelled saga: ${key}`);
  },

  cancelAll() {
    console.log('🛑 Cancelling all sagas...');
    runningSagas.forEach((task, key) => {
      task.cancel();
      console.log(`⏹️ Cancelled saga: ${key}`);
    });
    runningSagas.clear();
  },

  getRunning(): string[] {
    return Array.from(runningSagas.keys());
  },

  isRunning(key: string): boolean {
    return runningSagas.has(key);
  },
};