export class ids {
  /**
   * 构造器
   * @param {string} category
   */
  constructor( category ) {
    this.category = category || "default";
    this.id = 0 | ( Math.random() * 998 );
  }

  /**
   * 获取新的id
   */
  next() {
    return this.category + "." + ++this.id;
  }
}
