export type EntryOf<O> = {
    [K in keyof O]-?: [K, Exclude<O[K], undefined>]
}[O extends readonly unknown[] ? keyof O & number : keyof O] & unknown;

export type EntriesOf<O extends object> = EntryOf<O>[] & unknown;
