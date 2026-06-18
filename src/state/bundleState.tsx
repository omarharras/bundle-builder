import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import {
  type BundleQuantities,
  initialActiveVariants,
  initialQuantities,
  type ProductId,
  type StepId,
  type VariantId,
  products,
} from '../data/bundleData';
import { getNextStepId } from './bundleSelectors';

const STORAGE_KEY = 'bundle-builder-system';

export type BundleState = {
  openStepId: StepId | null;
  activeVariants: Record<ProductId, VariantId>;
  quantities: BundleQuantities;
  saveStatus: 'idle' | 'saved';
  checkoutStatus: 'idle' | 'confirmed';
};

export type BundleAction =
  | { type: 'openStep'; stepId: StepId }
  | { type: 'nextStep' }
  | { type: 'selectVariant'; productId: ProductId; variantId: VariantId }
  | { type: 'incrementQuantity'; productId: ProductId; variantId?: VariantId }
  | { type: 'decrementQuantity'; productId: ProductId; variantId?: VariantId }
  | { type: 'saveSystem' }
  | { type: 'checkout' };

const seededState: BundleState = {
  openStepId: 'cameras',
  activeVariants: initialActiveVariants,
  quantities: initialQuantities,
  saveStatus: 'idle',
  checkoutStatus: 'idle',
};

const getQuantityKey = (variantId?: VariantId) => variantId ?? 'default';

const getQuantity = (
  quantities: BundleQuantities,
  productId: ProductId,
  variantId?: VariantId,
) => quantities[productId]?.[getQuantityKey(variantId)] ?? 0;

const updateQuantity = (
  quantities: BundleQuantities,
  productId: ProductId,
  variantId: VariantId | undefined,
  change: 1 | -1,
) => {
  const quantityKey = getQuantityKey(variantId);
  const product = products.find((item) => item.id === productId);
  const minQuantity = product?.minQuantity ?? 0;
  const quantity = Math.max(
    minQuantity,
    getQuantity(quantities, productId, variantId) + change,
  );
  const next = { ...quantities };
  const productQuantities = { ...(next[productId] ?? {}) };

  if (quantity === 0) {
    delete productQuantities[quantityKey];
  } else {
    productQuantities[quantityKey] = quantity;
  }

  if (Object.keys(productQuantities).length === 0) {
    delete next[productId];
  } else {
    next[productId] = productQuantities;
  }

  return next;
};

const bundleReducer = (
  state: BundleState,
  action: BundleAction,
): BundleState => {
  switch (action.type) {
    case 'openStep':
      return {
        ...state,
        openStepId: state.openStepId === action.stepId ? null : action.stepId,
        saveStatus: 'idle',
      };
    case 'nextStep':
      return {
        ...state,
        openStepId: getNextStepId(state.openStepId ?? 'cameras'),
        saveStatus: 'idle',
      };
    case 'selectVariant':
      return {
        ...state,
        activeVariants: {
          ...state.activeVariants,
          [action.productId]: action.variantId,
        },
        saveStatus: 'idle',
      };
    case 'incrementQuantity':
      return {
        ...state,
        quantities: updateQuantity(state.quantities, action.productId, action.variantId, 1),
        saveStatus: 'idle',
      };
    case 'decrementQuantity':
      return {
        ...state,
        quantities: updateQuantity(state.quantities, action.productId, action.variantId, -1),
        saveStatus: 'idle',
      };
    case 'saveSystem':
      return { ...state, saveStatus: 'saved' };
    case 'checkout':
      return { ...state, checkoutStatus: 'confirmed' };
  }
};

const readSavedState = (): BundleState => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return seededState;
    }

    const parsed = JSON.parse(raw) as Partial<BundleState>;
    return {
      ...seededState,
      ...parsed,
      activeVariants: {
        ...seededState.activeVariants,
        ...parsed.activeVariants,
      },
      quantities: parsed.quantities ?? seededState.quantities,
      saveStatus: 'idle',
      checkoutStatus: 'idle',
    };
  } catch {
    return seededState;
  }
};

type BundleContextValue = {
  state: BundleState;
  dispatch: React.Dispatch<BundleAction>;
  saveSystem: () => void;
};

const BundleContext = createContext<BundleContextValue | undefined>(undefined);

export function BundleProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    bundleReducer,
    undefined,
    readSavedState,
  );

  const saveSystem = useCallback(() => {
    const stateToSave: BundleState = {
      ...state,
      saveStatus: 'idle',
      checkoutStatus: 'idle',
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    dispatch({ type: 'saveSystem' });
  }, [state]);

  const value = useMemo(
    () => ({ state, dispatch, saveSystem }),
    [saveSystem, state],
  );

  return (
    <BundleContext.Provider value={value}>{children}</BundleContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBundle = () => {
  const context = useContext(BundleContext);
  if (!context) {
    throw new Error('useBundle must be used inside BundleProvider');
  }
  return context;
};
