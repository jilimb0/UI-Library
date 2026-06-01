import { jsx as _jsx } from "react/jsx-runtime";
import { Children, cloneElement, isValidElement, } from 'react';
export function Slottable({ asChild, children, ...props }) {
    if (!asChild) {
        return _jsx("span", { ...props, children: children });
    }
    const child = Children.only(children);
    if (!isValidElement(child))
        return _jsx("span", { ...props, children: children });
    return cloneElement(child, {
        ...props,
        ...child.props,
        className: [
            props.className,
            child.props.className,
        ]
            .filter(Boolean)
            .join(' '),
    });
}
