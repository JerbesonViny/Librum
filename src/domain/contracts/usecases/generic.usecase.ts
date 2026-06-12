export interface UseCase<TInput, TOutput> {
  perform(input: TInput): Promise<TOutput | null> | TOutput | null;
}
