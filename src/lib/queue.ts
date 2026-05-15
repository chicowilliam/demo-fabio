import PQueue from 'p-queue';

export interface OptimizationResult {
  id: string;
  optimizedRoute: string[];
  estimatedTime: number;
}

export interface OptimizationTask {
  id: string;
  supermarketId: string;
  items: string[];
  onProgress?: (progress: number) => void;
  onComplete?: (result: OptimizationResult) => void;
}

// Create a queue for optimizing shopping routes/tasks
// Concurrency: 1 task at a time to ensure ordered optimization
export const optimizationQueue = new PQueue({
  concurrency: 1,
  interval: 1000,
  intervalCap: 5,
});

export const addOptimizationTask = async (
  task: OptimizationTask
): Promise<OptimizationResult> => {
  const queued = await optimizationQueue.add(async (): Promise<OptimizationResult> => {
    try {
      // TODO: Call backend optimization endpoint
      // For now, simulate optimization
      const simulatedDelay = Math.random() * 2000 + 1000;
      await new Promise(resolve => setTimeout(resolve, simulatedDelay));

      const result: OptimizationResult = {
        id: task.id,
        optimizedRoute: task.items.sort(), // Simple sort for now
        estimatedTime: Math.round(simulatedDelay / 1000),
      };

      task.onComplete?.(result);

      return result;
    } catch (error) {
      console.error('Optimization failed:', error);
      throw error;
    }
  });

  if (!queued) {
    throw new Error('Optimization queue returned no result');
  }

  return queued;
};

export const getQueueSize = () => optimizationQueue.size;
export const getPendingCount = () => optimizationQueue.pending;
