import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
export function Portal({ children }) {
    const [container, setContainer] = useState(null);
    useEffect(() => {
        const el = document.createElement('div');
        el.setAttribute('data-ui-portal', '');
        document.body.appendChild(el);
        setContainer(el);
        return () => {
            document.body.removeChild(el);
        };
    }, []);
    if (!container)
        return null;
    return createPortal(children, container);
}
