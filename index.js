import EventEmitter from 'events'
import * as array from './array.js'
import * as flatObject from './flat-object.js'

export const SERVER_ID = '0123456789abcdef'
export const MAX_SPRITES = 64
export const MAX_TILES = 64
export const MAP_WIDTH = 16
export const MAP_HEIGHT = 15
export const SPRITE_WIDTH = 16
export const SPRITE_HEIGHT = 16
export const TILE_WIDTH = 16
export const TILE_HEIGHT = 16

const DEFAULT_SPRITE = new Array(SPRITE_WIDTH * SPRITE_HEIGHT).fill(0)
const DEFAULT_SPRITES = new Array(MAX_SPRITES).fill(DEFAULT_SPRITE)
const DEFAULT_TILE = new Array(TILE_WIDTH * TILE_HEIGHT).fill(0)
const DEFAULT_TILES = new Array(MAX_TILES).fill(DEFAULT_TILE)

const DEFAULT_MAP = new Array(MAP_WIDTH * MAP_HEIGHT).fill(0)

const DEFAULT_PALETTE = [
  '#140c1c',
  '#442434',
  '#30346d',
  '#4e4a4e',
  '#854c30',
  '#346524',
  '#d04648',
  '#757161',
  '#597dce',
  '#d27d2c',
  '#8595a1',
  '#6daa2c',
  '#d2aa99',
  '#6dc2ca',
  '#dad45e',
  '#deeed6',
]

const MEMORY_TYPE = {
  SPRITES: 'sprites',
  TILES: 'tiles',
  MAP: 'map',
  USERS: 'users',
  PALETTE: 'palette',
}

class Memory {
  constructor() {
    this.emitter = new EventEmitter()
    this.emitter.setMaxListeners(0)
    this.sprites = array.create(DEFAULT_SPRITES, SERVER_ID)
    this.tiles = array.create(DEFAULT_TILES, SERVER_ID)
    this.map = array.create(DEFAULT_MAP, SERVER_ID)
    this.users = flatObject.create({}, SERVER_ID)
    this.palette = array.create(DEFAULT_PALETTE, SERVER_ID)
  }

  getSprite(index) {
    return array.get(this.sprites, index)
  }

  // The value should be an array of size SPRITE_HEIGHT * SPRITE_WIDTH
  // Each element in the array should be an index into the palette
  setSprite(index, value, version, userId) {
    const changes = array.set(this.sprites, index, value, version, userId)
    if (changes !== null) {
      this.emitter.emit(MEMORY_TYPE.SPRITES, index, changes)
    }
  }

  getTile(index) {
    return array.get(this.tiles, index)
  }

  // The value should be an array of size TILE_WIDTH * TILE_HEIGHT
  // Each element in the array should be an index into the palette
  setTile(index, value, version, userId) {
    const changes = array.set(this.tiles, index, value, version, userId)
    if (changes !== null) {
      this.emitter.emit(MEMORY_TYPE.TILES, index, changes)
    }
    return changes
  }

  getMap(index) {
    return array.get(this.map, index)
  }

  // The value should be an index into the tiles array
  setMap(index, value, version, userId) {
    const changes = array.set(this.map, index, value, version, userId)
    if (changes !== null) {
      this.emitter.emit(MEMORY_TYPE.MAP, index, changes)
    }
  }

  getUser(userId) {
    return flatObject.getChildByKey(this.users, userId)
  }

  setUser(value, version, userId) {
    const changes = flatObject.setChildByKey(
      this.users,
      userId,
      value,
      version,
      userId
    )
    if (changes !== null) {
      this.emitter.emit(MEMORY_TYPE.USERS, userId, changes)
    }
  }

  getColor(index) {
    return array.get(this.palette, index)
  }

  // The value should be a hex color string
  setColor(index, value, version, userId) {
    const changes = array.set(this.palette, index, value, version, userId)
    if (changes !== null) {
      this.emitter.emit(MEMORY_TYPE.PALETTE, index, changes)
    }
    return changes
  }

  subscribe(memoryType, callback) {
    this.emitter.addListener(memoryType, callback)
  }

  unsubscribe(memoryType, callback) {
    this.emitter.removeListener(memoryType, callback)
  }

  getSubscriptionCount(memoryType) {
    return this.emitter.listenerCount(memoryType)
  }
}

export default Memory
