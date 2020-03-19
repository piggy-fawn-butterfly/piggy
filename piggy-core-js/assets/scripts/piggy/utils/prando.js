export class prando {
  static random = new prando();
  static MIN = -2147483648; // Int32 min
  static MAX = 2147483647; // Int32 max

  // ================================================================================================================
  // CONSTRUCTOR ----------------------------------------------------------------------------------------------------

  /**
   * Generate a new Prando pseudo-random number generator.
   * @param {number | string} seed - A number or string seed that determines which pseudo-random number sequence will be created. Defaults to current time.
   */
  constructor( seed = null ) {
    if ( typeof seed === "string" ) {
      // String seed
      this._seed = this.hashCode( seed );
    } else if ( typeof seed === "number" ) {
      // Numeric seed
      this._seed = this.getSafeSeed( seed );
    } else {
      // Pseudo-random seed
      this._seed = this.getSafeSeed(
        prando.MIN + Math.floor( ( prando.MAX - prando.MIN ) * Math.random() )
      );
    }
    this.reset();
  }

  // ================================================================================================================
  // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

  /**
   * Generates a pseudo-random number between a lower (inclusive) and a higher (exclusive) bounds.
   *
   * @param {number} min - The minimum number that can be randomly generated.
   * @param {number} pseudoMax - The maximum number that can be randomly generated (exclusive).
   * @returns {number} The generated pseudo-random number.
   */
  next( min = 0, pseudoMax = 1 ) {
    this.recalculate();
    return this.map( this._value, prando.MIN, prando.MAX, min, pseudoMax );
  }

  /**
   * Generates a pseudo-random integer number in a range (inclusive).
   *
   * @param {number} min - The minimum number that can be randomly generated.
   * @param {number} max - The maximum number that can be randomly generated.
   * @returns {number} The generated pseudo-random number.
   */
  nextInt( min = 10, max = 100 ) {
    this.recalculate();
    return Math.floor(
      this.map( this._value, prando.MIN, prando.MAX, min, max + 1 )
    );
  }

  /**
   * Generates a pseudo-random string sequence of a particular length from a specific character range.
   *
   * Note: keep in mind that creating a random string sequence does not guarantee uniqueness; there is always a
   * 1 in (char_length^string_length) chance of collision. For real unique string ids, always check for
   * pre-existing ids, or employ a robust GUID/UUID generator.
   *
   * @param {number} length - Length of the string to be generated.
   * @param {string} chars - Characters that are used when creating the random string. Defaults to all alphanumeric chars (A-Z, a-z, 0-9).
   * @returns {string} The generated string sequence.
   */
  nextString(
    length = 16,
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  ) {
    let str = "";
    while ( str.length < length ) {
      str += this.nextChar( chars );
    }
    return str;
  }

  /**
   * Generates a pseudo-random string of 1 character specific character range.
   *
   * @param {string} chars - Characters that are used when creating the random string. Defaults to all alphanumeric chars (A-Z, a-z, 0-9).
   * @return {string} The generated character.
   */
  nextChar(
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  ) {
    this.recalculate();
    return chars.substr( this.nextInt( 0, chars.length - 1 ), 1 );
  }

  /**
   * Picks a pseudo-random item from an array. The array is left unmodified.
   *
   * Note: keep in mind that while the returned item will be random enough, picking one item from the array at a time
   * does not guarantee nor imply that a sequence of random non-repeating items will be picked. If you want to
   * *pick items in a random order* from an array, instead of *pick one random item from an array*, it's best to
   * apply a *shuffle* transformation to the array instead, then read it linearly.
   *
   * @param {any[]} array - Array of any type containing one or more candidates for random picking.
   * @return {any} An item from the array.
   */
  nextArrayItem( array ) {
    this.recalculate();
    return array[ this.nextInt( 0, array.length - 1 ) ];
  }

  /**
   * Generates a pseudo-random boolean.
   * @returns {boolean} A value of true or false.
   */
  nextBoolean() {
    this.recalculate();
    return this._value > 0.5;
  }

  /**
   * Skips ahead in the sequence of numbers that are being generated. This is equivalent to
   * calling next() a specified number of times, but faster since it doesn't need to map the
   * new random numbers to a range and return it.
   * @param {number} iterations - The number of items to skip ahead.
   */
  skip( iterations = 1 ) {
    while ( iterations-- > 0 ) {
      this.recalculate();
    }
  }

  /**
   * Reset the pseudo-random number sequence back to its starting seed. Further calls to next()
   * will then produce the same sequence of numbers it had produced before. This is equivalent to
   * creating a new Prando instance with the same seed as another Prando instance.
   *
   * Example:
   * let rng = new Prando(12345678);
   * console.log(rng.next()); // 0.6177754114889017
   * console.log(rng.next()); // 0.5784605181725837
   * rng.reset();
   * console.log(rng.next()); // 0.6177754114889017 again
   * console.log(rng.next()); // 0.5784605181725837 again
   */
  reset() {
    this._value = this._seed;
  }

  // ================================================================================================================
  // PRIVATE INTERFACE ----------------------------------------------------------------------------------------------

  /**
   * recalculate
   */
  recalculate() {
    this._value = this.xorshift( this._value );
  }

  /**
   * xor shift
   * @param {number} value
   */
  xorshift( value ) {
    // Xorshift*32
    // Based on George Marsaglia's work: http://www.jstatsoft.org/v08/i14/paper
    value ^= value << 13;
    value ^= value >> 17;
    value ^= value << 5;
    return value;
  }

  /**
   * map
   * @param {number} val
   * @param {number} minFrom
   * @param {number} maxFrom
   * @param {number} minTo
   * @param {number} maxTo
   */
  map( val, minFrom, maxFrom, minTo, maxTo ) {
    return ( ( val - minFrom ) / ( maxFrom - minFrom ) ) * ( maxTo - minTo ) + minTo;
  }

  /**
   * hash code
   * @param {string} str
   * @returns {number}
   */
  hashCode( str ) {
    let hash = 0;
    if ( str ) {
      const l = str.length;
      for ( let i = 0; i < l; i++ ) {
        hash = ( hash << 5 ) - hash + str.charCodeAt( i );
        hash |= 0;
        hash = this.xorshift( hash );
      }
    }
    return this.getSafeSeed( hash );
  }

  /**
   * safe seed
   * @param {number} seed
   * @returns {number}
   */
  getSafeSeed( seed ) {
    if ( seed === 0 ) return 1;
    return seed;
  }
}
