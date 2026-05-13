import PQueue from 'p-queue';

// Create a queue for optimizing shopping routes/tasks
// Concurrency: 1 task at a time to ensure ordered optimization
export const optimizationQueue = new PQueue({
  concurrency: 1,
  interval: 1000,
  intervalCap: 5,
});

export interface OptimizationTask {
  id: string;
  supermarketId: string;
  items: string[];
  onProgress?: (progress: number) => void;
  onComplete?: (result: any) => void;
}

export const addOptimizationTask = async (
  task: OptimizationTask
): Promise<any> => {
  return optimizationQueue.add(async () => {
    try {
      // TODO: Call backend optimization endpoint
      // For now, simulate optimization
      const simulatedDelay = Math.random() * 2000 + 1000;
      await new Promise(resolve => setTimeout(resolve, simulatedDelay));

      task.onComplete?.({
        id: task.id,
        optimizedRoute: task.items.sort(), // Simple sort for now
        estimatedTime: Math.round(simulatedDelay / 1000),
      });

      return {
        id: task.id,
        optimizedRoute: task.items.sort(),
        estimatedTime: Math.round(simulatedDelay / 1000),
      };
    } catch (error) {
      console.error('Optimization failed:', error);
      throw error;
    }
  });
};

export const getQueueSize = () => optimizationQueue.size;
export const getPendingCount = () => optimizationQueue.pending;
