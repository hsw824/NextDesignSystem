import { RefObject, useEffect, useRef, useState } from 'react';

type Elem = Element | null;
const useIntersectionObserver = (
	elemRef: RefObject<Elem>,
	options: IntersectionObserverInit,
) => {
	const observerRef = useRef<IntersectionObserver>();
	const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);

	useEffect(() => {
		const node = elemRef.current;
		if (!node) return;
		observerRef.current = new IntersectionObserver((entries) => {
			setEntries(entries);
		}, options);
		observerRef.current.observe(node);

		return () => {
			observerRef.current?.disconnect();
		};
	}, [elemRef, options]);

	return { entries, observerRef };
};

export default useIntersectionObserver;
