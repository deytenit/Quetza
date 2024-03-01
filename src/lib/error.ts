/**
 * Base class for all quetza's errors.
 *
 * @public
 */
export default class QuetzaError extends Error {
    /**
     * Default prefix value stands for quetza's base features.
     */
    public static readonly DEFAULT_PREFIX = "QZ";

    /**
     * Error code is an identifier for specific Error in the same module.
     */
    public readonly code: number;

    /**
     * Prefix defines module where Error has occured.
     *
     * @defaultValue `QuetzaError.DEFAULT_PREFIX`
     */
    public readonly prefix: string;

    /**
     * Constructs QuetzaError class.
     *
     * @param msg - Error message (that shall not be displayed to end user)
     * @param code - {@link code | Code} unique to error in module
     * @param prefix - Identifier of module where error has occurred
     */
    public constructor(msg: string, code: number, prefix = QuetzaError.DEFAULT_PREFIX) {
        super(msg);
        this.code = code;
        this.prefix = prefix;
    }

    /**
     * Must create a unique error ID if no collision bugs were written.
     *
     * @returns error ID as concatenation of {@link prefix} and {@link code}
     *
     * @example
     * ```ts
     * const error = new QuetzaError("Some error.", 404, "NF");
     *
     * error.getErrorId(); // "NF404"
     * ```
     */
    public getErrorId(): string {
        return this.prefix + this.code.toString();
    }
}
