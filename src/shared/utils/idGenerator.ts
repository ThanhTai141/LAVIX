// Generate unique ID cho messages
export const generateMessageId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
 
// Generate unique ID cho optimistic updates
export const generateOptimisticId = (): string => {
  return `optimistic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}; 