import currentDispatcher, {
	Dispatcher,
	resolveDispatcher
} from './src/currentDispatcher';
import currentBatchConfig from './src/currentBatchConfig';
import * as jsx from './src/jsx';
export { createContext } from './src/context';
export {
	REACT_SUSPENSE_TYPE as Suspense,
	REACT_FRAGMENT_TYPE as Fragment
} from 'shared/ReactSymbol';
// React

/**
 * @description 向外暴露的 useState Dispatcher
 * @param initialState 初始状态
 * @returns [State, Dispatch<State>] 状态和更新函数
 */
export const useState: Dispatcher['useState'] = (initialState) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useState(initialState);
};

export const useEffect: Dispatcher['useEffect'] = (create, deps) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useEffect(create, deps);
};

export const useTransition: Dispatcher['useTransition'] = () => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useTransition();
};

export const useRef: Dispatcher['useRef'] = (initialValue) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useRef(initialValue);
};

export const useContext: Dispatcher['useContext'] = (context) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useContext(context);
};

// 内部数据共享层
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
	currentDispatcher,
	currentBatchConfig
};

export const version = '0.0.0';
// TODO 根据环境区分使用 jsx / jsxDEV
export const createElement = jsx.jsx;
export const isValidElement = jsx.isValidElement;
