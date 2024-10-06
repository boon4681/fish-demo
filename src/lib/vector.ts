export class Vector2D {
    x: number;
    y: number;

    /**
     * Creates a new Vector2D instance.
     * @param {number} x - The x-component of the vector.
     * @param {number} y - The y-component of the vector.
     */
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Adds another vector to this vector.
     * @param {Vector2D} other - The vector to add.
     * @returns {Vector2D} A new vector representing the sum.
     */
    add(other: Vector2D): Vector2D {
        return new Vector2D(this.x + other.x, this.y + other.y);
    }

    /**
     * Subtracts another vector from this vector.
     * @param {Vector2D} other - The vector to subtract.
     * @returns {Vector2D} A new vector representing the difference.
     */
    subtract(other: Vector2D): Vector2D {
        return new Vector2D(this.x - other.x, this.y - other.y);
    }

    /**
     * Multiplies this vector by a scalar.
     * @param {number} scalar - The scalar to multiply by.
     * @returns {Vector2D} A new vector representing the scaled vector.
     */
    multiply(scalar: number): Vector2D {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    /**
     * Divides this vector by a scalar.
     * @param {number} scalar - The scalar to divide by.
     * @returns {Vector2D} A new vector representing the scaled vector.
     * @throws {Error} If scalar is zero.
     */
    divide(scalar: number): Vector2D {
        if (scalar === 0) {
            throw new Error("Division by zero.");
        }
        return new Vector2D(this.x / scalar, this.y / scalar);
    }

    /**
     * Calculates the dot product of this vector and another vector.
     * @param {Vector2D} other - The other vector.
     * @returns {number} The dot product.
     */
    dot(other: Vector2D): number {
        return this.x * other.x + this.y * other.y;
    }

    /**
     * Calculates the magnitude (length) of the vector.
     * @returns {number} The magnitude.
     */
    magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    /**
     * Returns a normalized (unit length) version of this vector.
     * @returns {Vector2D} The normalized vector.
     * @throws {Error} If the vector is zero-length.
     */
    normalize(): Vector2D {
        const mag = this.magnitude();
        if (mag === 0) {
            this.x = 0;
            this.y = 0;
            return this
            throw new Error("Cannot normalize a zero-length vector.");
        }
        return this.divide(mag);
    }

    /**
     * Calculates the distance between this vector and another vector.
     * @param {Vector2D} other - The other vector.
     * @returns {number} The distance.
     */
    distanceTo(other: Vector2D): number {
        return this.subtract(other).magnitude();
    }

    /**
     * Rotates the vector by a given angle in radians.
     * @param {number} angle - The angle to rotate by, in radians.
     * @returns {Vector2D} The rotated vector.
     */
    rotate(angle: number): Vector2D {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2D(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    /**
     * Returns a string representation of the vector.
     * @returns {string} The string representation.
     */
    toString(): string {
        return `Vector2D(${this.x}, ${this.y})`;
    }

    /**
     * Creates a copy of this vector.
     * @returns {Vector2D} A new vector with the same components.
     */
    clone(): Vector2D {
        return new Vector2D(this.x, this.y);
    }

    /**
     * Checks if this vector is equal to another vector.
     * @param {Vector2D} other - The other vector.
     * @returns {boolean} True if vectors are equal, false otherwise.
     */
    equals(other: Vector2D): boolean {
        return this.x === other.x && this.y === other.y;
    }

    /**
     * Linearly interpolates between this vector and another vector.
     * @param {Vector2D} other - The target vector.
     * @param {number} t - The interpolation factor (0 <= t <= 1).
     * @returns {Vector2D} The interpolated vector.
     */
    lerp(other: Vector2D, t: number): Vector2D {
        return new Vector2D(
            this.x + (other.x - this.x) * t,
            this.y + (other.y - this.y) * t
        );
    }
    /**
     * Get the heading (angle) of the vector in radians relative to the x-axis.
     * @returns {number} The angle in radians.
     */
    heading(): number {
        return Math.atan2(this.y, this.x);
    }

    limit(max: number): Vector2D {
        if (this.magnitude() > max) {
            const v = this.normalize().multiply(max);
            this.x = v.x;
            this.y = v.y;
        }
        return this;
    }

    static one() {
        return new Vector2D(1, 1)
    }
    static fromAngle(angle: number): Vector2D {
        return new Vector2D(Math.cos(angle), Math.sin(angle));
    }
}
