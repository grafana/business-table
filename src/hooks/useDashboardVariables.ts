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
  const [variables, setVariables] = useState<TState>(initial);
  const [variable, setVariable] = useState<TVariable>();

  /**
   * Scene context support
   */
  const sceneContext = (window as { __grafanaSceneContext?: { useState: () => { $variables?: { state: { variables: Array<{ state: { loading: boolean } }> } } } } }).__grafanaSceneContext?.useState();
  const [checkCount, incrementCheckCount] = useReducer((count: number) => count + 1, 0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Watch scene variables loading state
   */
  useEffect(() => {
    if (!sceneContext?.$variables?.state.variables || checkCount >= refreshCheckCount) {
      return;
    }

    const sceneVars = sceneContext.$variables.state.variables;
    const isLoading = sceneVars.some((v) => v?.state.loading);

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
  }, [sceneContext?.$variables?.state.variables, checkCount, refreshCheckCount, refreshCheckInterval]);

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
