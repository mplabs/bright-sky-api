const hasOwnProperty = Object.prototype.hasOwnProperty
const objectProto = Object.prototype
const toString = Object.prototype.toString

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
export function getTag(value: any): string {
    if (value == null) {
        return value === undefined ? '[object Undefined]' : '[object Null]'
    }
    return toString.call(value)
}

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * isEmpty(null)
 * // => true
 *
 * isEmpty(true)
 * // => true
 *
 * isEmpty(1)
 * // => true
 *
 * isEmpty([1, 2, 3])
 * // => false
 *
 * isEmpty('abc')
 * // => false
 *
 * isEmpty({ 'a': 1 })
 * // => false
 */
export function isEmpty(value?: any): boolean {
    if (null === value || 'undefined' === typeof value) {
        return true
    }

    if (Array.isArray(value) || 'string' === typeof value || 'function' === typeof value.splice) {
        return !value.length
    }

    const tag = getTag(value)
    if (tag == '[object Map]' || tag == '[object Set]') {
        return !value.size
    }

    if (isPrototype(value)) {
        return !Object.keys(value).length
    }
    for (const key in value) {
        if (hasOwnProperty.call(value, key)) {
            return false
        }
    }
    return true
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
export function isPrototype(value: any): boolean {
    const Ctor = value && value.constructor
    const proto = (typeof Ctor === 'function' && Ctor.prototype) || objectProto

    return value === proto
}

export function skipEmpty<T>(obj: { [s: string]: unknown } | ArrayLike<unknown>): T {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => !isEmpty(v))
    ) as T
}
