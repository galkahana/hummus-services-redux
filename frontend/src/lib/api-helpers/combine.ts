/**
 * A naive implementation of wrappers for functions with support for null mws which
 * allows for option noops.
 *
 * combine(....mws) creates a reusable wrapper that when executed on a function creates
 * a replacement function that behaves like the original function but allows mws to alter
 * the original return value execution conditions.
 * mws are executed last to first, so the latest in the params array the middleware is
 * the earlier it gets executed.
 *
 * for example:
 * function a(func){...}
 * function b(func){...}
 * function c(...){...}
 * const combination = combine(a,b)
 * const ehnancement = combination(c)
 *
 * const result = ehnancement(...)
 *
 * This code creates an enhanced version of c function where b and then a can enhance
 * the output from c. b or a are functions that receive a func as a parameter which they should
 * call when wanting to execute the "original".
 *
 * two things of note:
 * - mws can contian nulls. in such cases the mw will be considered as a no-op and is passed through
 * - this metod support passing params to the end result enhanced function, and those params will be passed
 *   to the original call...don't worry. in this sense, it is a true wrapper
 *
 * @param  {...any} mws
 */

// I literally have no idea how to make this into meaningful typescript. type the resultant MW instead.

export default function combine(...mws: Nullable<any>[]): any {
    if (mws.length === 0) {
        return (call: any) => call
    }

    const [ firstMW, ...restMWs ] = mws

    if (!firstMW) {
        // allow null/undefined as no-ops
        return (call: Function) => combine(...restMWs)(call)
    } else {
        return (call: Function) => (...rest: any[]) =>
            firstMW(() => combine(...restMWs)(call)(...rest))
    }
}
