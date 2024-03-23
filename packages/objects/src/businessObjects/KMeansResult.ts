export interface KMeansResult {
  clusters: number[];
  centroids: number[][]; // { centroid: number[], error: number, size: number }[],
  converged: boolean;
  iterations: number;
}
