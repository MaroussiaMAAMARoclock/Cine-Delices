import validator from "validator";
import slugify from "slugify";
import client from "../database.js";

class Website {

  #id;
  #name;
  #slug;
  #score;
  #step;
  #address;
  #device;
  #level;

  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.slug = slugify(config.name, {
      lower: true,
      strict: true,
    });
    this.score = config.score;
    this.step = config.step;
    this.address = config.address;
    this.device = config.device;
    this.level = config.level;
  }
  
  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get slug() {
    return this.#slug;
  }

  get score() {
    return this.#score;
  }

  get step() {
    return this.#step;
  }

  get address() {
    return this.#address;
  }

  get device() {
    return this.#device;
  }

  get level() {
    return this.#level;
  }
  
  set id(value) {
    if (typeof value !== 'number' && typeof value !== 'undefined') {
      throw new Error('Id incorrect');
    }
    this.#id = value;
  }

  set name(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('Titre incorrect');
    }
    this.#name = value.trim();
  }

  set slug(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('Slug incorrect');
    }
    this.#slug = value.trim();
  }

  set score(value) {
    this.#score = value;
  }

  set step(value) {
    this.#step = value;
  }

  set address(value) {
    if (!validator.isURL(value)) {
      throw new Error('Adresse incorrecte');
    }
    this.#address = value;
  }

  set device(value) {
    const allowedValues = ['Mobile', 'Ordinateur', 'Lecteur d\'écran'];
    if (typeof value !== 'undefined' && !allowedValues.includes(value)) {
      throw new Error(`3 valeurs autorisées : ${allowedValues.join(', ')}`);
    }
    this.#device = value;
  }

  set level(value) {
    const allowedValues = ['Bloquant', 'Gênant', 'Casse-tête'];
    if (typeof value !== 'undefined' && !allowedValues.includes(value)) {
      throw new Error(`3 valeurs autorisées : ${allowedValues.join(', ')}`);
    }
    this.#level = value;
  }

  async create() {
    const text = `
      INSERT INTO recipe ("name", "slug","score", "step", "address", "device", "level")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `; 
    const values = [this.name, this.slug, this.score, this.step, this.address, this.device, this.level];
    const result = await client.query(text, values);
    this.#id = result.rows[0].id; 
  }

  static async read(id) {
    const text = `
      SELECT * FROM website
      WHERE id = $1;
    `;
    const values = [id];
    const result = await client.query(text, values);
    if (result.rowCount > 0) {
      return new Website(result.rows[0]);
    }
    else {
      throw new Error('Site non trouvé');
    }
  }

  async update() {
    const text = `
      UPDATE website 
      SET 
        "name" = $1,
        "slug" = $2,
        "step" = $3,
        "address" = $4,
        "device" = $5,
        "level" = $6
      WHERE id = $7;
    `;
    const values = [this.name, this.slug, this.score, this.step, this.address, this.device, this.level, this.id];
    client.query(text, values);
  }

  async delete() {
    const text = `
      DELETE FROM website 
      WHERE id = $1;
    `;
    const values = [this.id];
    client.query(text, values);
  }

}

export default Website;
