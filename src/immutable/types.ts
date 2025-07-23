export type ValueMatcher<T> = T | ((value: T) => boolean);
export type KeyMatcher<K> = K | ((key: K) => boolean); 