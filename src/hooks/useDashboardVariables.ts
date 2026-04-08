import { EventBus, TypedVariableModel } from '@grafana/data';
import { getTemplateSrv, RefreshEvent } from '@grafana/runtime';

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

/**
 * Use Dashboard Variables
 */
export const useDashboardVariables = <TVariable = TypedVariableModel, TState = TVariable[]>({
  eventBus,
  variableName,
  refreshCheckCount = 5,
  refreshCheckInterval = 500,
  getOne,
  toState,
  initial,
}: {
  eventBus: EventBus;
  variableName: string;
  refreshCheckCount?: number;
  refreshCheckInterval?: number;
  initial: TState;
  getOne: (state: TState, variableName: string) => TVariable | undefined;
  toState: (variables: TypedVariableModel[]) => TState;
}) => {
  const callbacksRef = useRef({ getOne, toState });
  // eslint-disable-next-line react-hooks/refs -- keeps ref in sync with latest callbacks
  callbacksRef.current = { getOne, toState };
  const [variables, setVariables] = useState<TState>(initial);
  const [variable, setVariable] = useState<TVariable>();

  /**
   * Scene context support — subscribe manually to avoid conditional hook call
   */
  const [sceneVarsState, setSceneVarsState] = useState<
    Array<{ state: { loading: boolean } }> | undefined
  >();
  const [checkCount, incrementCheckCount] = useReducer((count: number) => count + 1, 0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Subscribe to scene context state changes
   */
  useEffect(() => {
    const sceneContext = window.__grafanaSceneContext;
    if (!sceneContext) {
      return;
    }

    const getSceneVars = (state: Record<string, unknown>) =>
      (state.$variables as { state: { variables: Array<{ state: { loading: boolean } }> } } | undefined)?.state
        .variables;

    setSceneVarsState(getSceneVars(sceneContext.state as Record<string, unknown>));

    const subscription = sceneContext.subscribeToState((newState) => {
      setSceneVarsState(getSceneVars(newState as Record<string, unknown>));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Watch scene variables loading state
   */
  useEffect(() => {
    if (!sceneVarsState || checkCount >= refreshCheckCount) {
      return;
    }

    const isLoading = sceneVarsState.some((v) => v?.state.loading);

    const clearTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    if (isLoading) {
      timeoutRef.current = setTimeout(() => {
        incrementCheckCount();
      }, refreshCheckInterval);
    } else {
      clearTimer();
      setVariables(callbacksRef.current.toState(getTemplateSrv().getVariables()));
    }

    return clearTimer;
  }, [sceneVarsState, checkCount, refreshCheckCount, refreshCheckInterval]);

  /**
   * Sync variables on refresh events
   */
  useEffect(() => {
    setVariables(callbacksRef.current.toState(getTemplateSrv().getVariables()));

    const subscription = eventBus.getStream(RefreshEvent).subscribe(() => {
      setVariables(callbacksRef.current.toState(getTemplateSrv().getVariables()));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [eventBus]);

  /**
   * Get Variable
   */
  const getVariable = useCallback(
    (name: string) => callbacksRef.current.getOne(variables, name),
    [variables]
  );

  /**
   * Sync current variable
   */
  useEffect(() => {
    setVariable(getVariable(variableName));
  }, [getVariable, variableName]);

  return { variable, getVariable, variables };
};
