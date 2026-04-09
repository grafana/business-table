import { BoundFunctions, Queries, Screen } from '@testing-library/react';

/**
 * Jest Selector
 */
type JestSelector<TArgs extends unknown[]> = (
  noThrowOnNotFound?: boolean,
  ...args: TArgs
) => ReturnType<Screen['getByTestId']>;

/**
 * Check If Selector Object
 */
type IsSelectorObject<TCandidate> = TCandidate extends {
  selector: (...args: unknown[]) => void;
  apply: (...args: unknown[]) => void;
}
  ? TCandidate & {
      selector: TCandidate['selector'];
      apply: TCandidate['apply'];
    }
  : never;

/**
 * Jest Selectors
 */
type JestSelectors<T> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => void
    ? JestSelector<Args>
    : T[K] extends IsSelectorObject<T[K]>
      ? JestSelector<Parameters<T[K]['selector']>>
      : JestSelector<[]>;
};

/**
 * Selector Function
 */
type SelectorFn = (...args: unknown[]) => string;

/**
 * Get Jest Selectors
 */
export const getJestSelectors = <TSelectors extends Record<keyof TSelectors, TSelectors[keyof TSelectors]>>(
  selectors: TSelectors,
  enforceTestIdSelectorForKeys: Array<keyof TSelectors> = []
) => {
  return (screen: Screen | BoundFunctions<Queries>): JestSelectors<TSelectors> => {
    return Object.entries(selectors).reduce(
      (acc, [key, selector]) => {
        const getElement = (noThrowOnNotFound = false, ...args: unknown[]) => {
          const getValue =
            typeof selector === 'object' && selector !== null && 'selector' in selector
              ? (selector as { selector: SelectorFn }).selector
              : selector;
          const value = typeof getValue === 'function' ? getValue(...args) : getValue;
          if (
            (typeof value === 'string' && value.startsWith('data-testid')) ||
            enforceTestIdSelectorForKeys.includes(key as keyof TSelectors)
          ) {
            return noThrowOnNotFound ? screen.queryByTestId(value as string) : screen.getByTestId(value as string);
          }
          return noThrowOnNotFound
            ? screen.queryByLabelText(value as string)
            : screen.getByLabelText(value as string);
        };
        return {
          ...acc,
          [key]: getElement,
        };
      },
      {} as JestSelectors<TSelectors>
    );
  };
};

/**
 * Create Selector
 */
/* eslint-disable no-redeclare -- TypeScript function overloads */
export function createSelector<TSelector extends string | SelectorFn>(
  selector: TSelector,
  propName?: string
): TSelector extends string
  ? { selector: () => string; apply: () => Record<string, string> }
  : { selector: TSelector; apply: (...args: Parameters<TSelector & SelectorFn>) => Record<string, string> };
export function createSelector(selector: string | SelectorFn, propName?: string) {
  /* eslint-enable no-redeclare */
  const selectorFn = typeof selector === 'string' ? () => selector : selector;
  let attrName = 'aria-label';
  if (propName) {
    attrName = propName;
  } else if (selectorFn().startsWith('data-testid')) {
    attrName = 'data-testid';
  }
  return {
    selector: selectorFn,
    apply: (...args: unknown[]) => ({
      [attrName]: selectorFn(...args),
    }),
  };
}
