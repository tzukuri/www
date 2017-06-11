// http://www.couchcoder.com/using-memoized-decorator-cache-computed-properties/
export default function memoise(target, propertyKey, descriptor) {
    let value
    let originalGet = descriptor.get
 
    descriptor.get = function() {
        if (!this.hasOwnProperty('__memoised__')) {
            Object.defineProperty(this, '__memoised__', { value: new Map() })
        }
 
        return this.__memoised__.has(propertyKey) ?
            this.__memoised__.get(propertyKey) :
            (() => {
                const value = originalGet.call(this)
                this.__memoised__.set(propertyKey, value)
                return value
            })()
    }
}
